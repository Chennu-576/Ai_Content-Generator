from fastapi import FastAPI, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import os
from bs4 import BeautifulSoup
import requests
import re
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client
from datetime import datetime
import uvicorn
import logging
import functools
from typing import Any, Callable

# ----------------------------------------------------------------------------
# Logging
# ----------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------------------------------------------------------------------
# Load .env
# ----------------------------------------------------------------------------
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

# ----------------------------------------------------------------------------
# FastAPI app + CORS
# ----------------------------------------------------------------------------
app = FastAPI(title="AI Blog Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------------
# Environment variables
# ----------------------------------------------------------------------------
gemini_api_key = os.getenv("GEMINI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

logger.info("Environment check - Gemini Key: %s", "LOADED" if gemini_api_key else "MISSING")
logger.info("Environment check - Supabase URL: %s", "LOADED" if supabase_url else "MISSING")
logger.info("Environment check - Supabase ServiceKey: %s", "LOADED" if supabase_service_key else "MISSING")

# ----------------------------------------------------------------------------
# Initialize Gemini
# ----------------------------------------------------------------------------
client = None
try:
    if gemini_api_key:
        client = genai.Client(api_key=gemini_api_key)
        logger.info("Gemini client initialized")
    else:
        logger.warning("Gemini client not initialized - API key missing")
except Exception as e:
    logger.error("Gemini initialization failed: %s", e)
    client = None

# ----------------------------------------------------------------------------
# Initialize Supabase
# ----------------------------------------------------------------------------
supabase = None
try:
    if supabase_url and supabase_service_key:
        supabase = create_client(supabase_url, supabase_service_key)
        logger.info("Supabase client initialized")
    else:
        logger.warning("Supabase client not initialized - credentials missing")
except Exception as e:
    logger.error("Supabase initialization failed: %s", e)
    supabase = None

# ----------------------------------------------------------------------------
# Safe iteration decorator
# ----------------------------------------------------------------------------
def safe_iteration_handler(func: Callable) -> Callable:
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except TypeError as e:
            if "not iterable" in str(e):
                logger.error(f"Iteration error in {func.__name__}: {e}")
                raise HTTPException(status_code=422, detail=f"Invalid data format: {str(e)}")
            raise
    return wrapper

# ----------------------------------------------------------------------------
# Prompt templates
# ----------------------------------------------------------------------------
TEMPLATE_PROMPT = """
You are an experienced marketing writer who has worked on real campaigns in {topic}.
Your job is to write a blog post that feels genuinely human — conversational, emotionally real, and SEO-optimized.

Write a blog post about {topic} in {language} with approximately {word_count} words, keeping every section closely aligned with the topic and 100% professional.

VOICE & STYLE
Start with a compelling hook directly tied to the topic — no generic intros or filler.
The opening should instantly connect to the reader’s real-world problem, curiosity, or goal about {topic}.
Write conversationally, like you're chatting with a smart friend — natural, fluid, warm.
Use contractions and occasional pauses for rhythm.
Avoid robotic or repetitive phrases and buzzwords like "leading-edge," "solutions," or "maximize ROI."
Keep flow dynamic: mix short punchy lines with reflective thoughts.
Maintain natural flow between ideas; avoid sudden jumps or off-topic transitions.
Use light humor or honesty ("let's be real," "you've probably seen this before").

CONTENT DEPTH & QUALITY
Every paragraph should provide meaningful insight or experience; no filler.
Explain the "why" behind tactics clearly.
Include at least one detailed real-world example or case study relevant to {topic} that demonstrates practical application and results.
Use authentic numbers, measurable impact, or customer story insights where possible.
Mention {company_name} naturally once or twice in context, never as overt promotion.
Keep paragraphs short for readability (max 3–4 lines).
Incorporate any ‘Additional Details’ naturally into the blog’s structure, language, and style.

STRUCTURE & LENGTH CONTROL
For 500 words:
Hook Title (H1)
Introduction (70–100 words)
What is {topic}?
Why it matters / Key Benefits
How it works / Practical Steps
Tips, Insights, or Common Mistakes (80–100 words)
Final thoughts (2–3 lines)
CTA (2–3 lines, with a heading like “Ready to Take Action?” or “Start Today”; motivational and on-topic)

For 800 words:
Hook Title (H1)
Introduction (100–150 words)
What is {topic}? (100–150 words)
Why it matters / Core Benefits (100–150 words)
How it works / Steps (100–150 words)
Real-world Example or Use Case (100–150 words)
Tips or Mistakes to Avoid (100–150 words)
Key Takeaways (3–5 bullet points)
FAQs (optional, 3–4 short Q&A)
Final thoughts (80–100 words)
CTA (2–3 lines with own heading)

For 1200 words:
Hook Title (H1)
Introduction (100–140 words)
What is {topic}? (100–150 words)
Why it matters / Core Benefits (100–150 words)
How it works / Step-by-step (100–200 words)
Real-world Examples or Case Studies (100–150 words)
Best Practices or Mistakes to Avoid (100–150 words)
Tools / Recommendations (100–150 words)
FAQs (4–5 short Q&A, optional)
Future Trends / What’s Next (100–120 words)
Summary / Key Takeaways (3–5 bullet points)
Final thoughts (80–100 words), summarizing key takeaways and tying back to {topic}.
Use bullet points or numbered lists where helpful.
CTA (2–3 lines with own heading)

SECTION-SPECIFIC FORMATTING
- Introduction: exactly 2 short paragraphs, no bullets.
- What is {topic}?: 2 short paragraphs + 1 bullet list (3–5 bullets).
- Why it matters: 1 problem paragraph + bullets for benefits.
- How it works: must be a numbered list (4–6 steps).
- Case studies: 1 setup paragraph + bullet-point results.
- Best practices: bullets only, no long prose.
- Tools: one-line description per tool.
- FAQs: each answer max 3 lines.
- Final thoughts: max 2 short paragraphs.

PARAGRAPH & FORMAT RULES (STRICT)
- No paragraph may exceed 4 sentences.
- Each paragraph must focus on one idea only.
- Break paragraphs immediately after a complete thought.
- Never write more than 80–90 words without a paragraph break.
- If a section exceeds 120 words, include at least one bullet or numbered list.
- Use bullets for steps, benefits, tools, examples, and takeaways.
- Bullets should be short, conversational, and human — not textbook-style.
- Visually long paragraphs must be split, even if the idea flows.

SEO & READABILITY
Maintain keyword density around 1%–1.5%, naturally using LSI/related keywords.
Write at Grade 8–9 readability.
Favor active voice; minimize passive voice.
Ensure factual accuracy and topical authority.
Keep sentence variation natural to boost AI detection human score.
Avoid keyword stuffing or robotic phrasing.
Naturally integrate all user-provided keywords (entered in the Keywords field) into the blog content—including title, headings, and body—to maximize SEO score for every keyword.

SEO MANDATORY (8 rules - FAIL = regenerate):
 Title: 50-60 chars, starts with main keyword
 H1: Exactly 1, contains main keyword in first 500 chars
 H2: 3-5 total, 1 contains keyword variation
 Keyword density: 1-2% main keyword naturally
 First 100 words: Main keyword 1-2x
 Lists: Use - or 1. bullets 2+ times
 Paragraphs: 8+ short paras (3-4 lines max)
 Sentences: 15-25 words average

HUMANIZATION TRIGGERS
Add micro-stories or mini anecdotes to sound real.
Use natural imperfections and rhythm variations.
Avoid mirrored phrasing or repetitive line patterns.
Prioritize flow and emotion over perfect grammar — write like a real person.

OUTPUT RULES
Target approximately {word_count} words exactly.
Fully focus on {topic} content.
Avoid repeating any phrase more than twice unless natural.
Format output in markdown with clear headings and spacing.

Content must pass human percentage tests on AI detection tools like QuillBot and ZeroGPT, scoring high on human likeness.
"""

SYSTEM_MESSAGE = """
You are a senior marketing strategist and human-style storyteller, skilled at writing SEO-rich blogs that connect emotionally with readers.
Your task is to create content that sounds lived, genuine, and grounded — not like AI output.

TONE & STYLE
Start with a natural, topic-focused hook that feels real, no scripts or corporate fluff.
Write warmly, conversationally, with natural sentence variety.
Avoid robotic structure, symmetry, or buzzwords.
Use contractions and relatable asides for natural rhythm.
Let writing breathe — slight imperfections are human.

CONTENT GUIDELINES
Stay fully on-topic.
Maintain logical flow between title, headings, and content.
Include real or believable examples and case studies with authentic data.
Keep paragraphs concise but reach total target length.
Conclude with a distinct, motivational CTA that is relevant to the topic.

WORD COUNT ADAPTATION
Short posts (500-800 words): focus on 3-4 core insights with punchy examples.
Medium posts (800-1200 words): detailed explanations and multiple actionable tips.
Long posts (1201+ words): comprehensive coverage including case studies, step-by-step guides, FAQs, and future outlook.
Prioritize quality over filler.

SEO & QUALITY CONTROL
Ensure high SEO coherence — titles, headings, subheadings, and text must reinforce the topic.
Balance SEO with a natural tone; never force keywords.
Avoid repetition or mirrored sentence styles.
Maintain high readability and human percentage.
Favor active voice; minimize passive voice constructions.
Seamlessly include all user-entered keywords throughout the blog content.

HUMAN-LIKE TOUCHES
Vary sentence lengths and rhythm.
Include small reflections or real-life insights.
Avoid exaggerated claims; keep grounded.
Generated content should feel authentically human and professional.
"""

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
def scrape_content_from_url(url: str) -> str:
    try:
        res = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        return " ".join(p.get_text() for p in soup.find_all("p"))[:2000]
    except Exception as e:
        logger.warning(f"Scrape error for {url}: {e}")
        return ""


def safe_ensure_list(data: Any) -> list:
    """Safely convert any data to a list without iteration errors."""
    if data is None:
        return []
    elif isinstance(data, list):
        return data
    elif isinstance(data, str):
        return [item.strip() for item in data.split(',') if item.strip()]
    elif hasattr(data, '__iter__') and not isinstance(data, (str, dict)):
        try:
            return list(data)
        except Exception:
            return [str(data)]
    else:
        return [str(data)]


def calculate_seo_score(title: str, content: str, keywords) -> float:
    """Calculate an SEO score between 0 and 10."""
    score = 0.0
    max_score = 10.0

    safe_keywords = safe_ensure_list(keywords)
    if not safe_keywords:
        return 5.0  # Baseline when no keywords given

    main_kw = str(safe_keywords[0]).lower().strip()
    content_lower = content.lower()
    title_lower = title.lower()

    # Clean content for accurate word count
    clean_content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    clean_content = re.sub(r'`[^`]*`', '', clean_content)
    clean_content = re.sub(r'[#*_\-\[\]!`]', '', clean_content)
    word_count = len(clean_content.split())

    # 1. Title optimization (max 2.5)
    title_len = len(title)
    if 50 <= title_len <= 60:
        score += 1.0
    elif 40 <= title_len <= 70:
        score += 0.8
    elif 30 <= title_len <= 80:
        score += 0.5

    if main_kw in title_lower:
        score += 1.0
    elif any(str(kw).lower() in title_lower for kw in safe_keywords if len(str(kw)) > 2):
        score += 0.5

    if title_lower.startswith(main_kw):
        score += 0.5

    # 2. Content length (max 2.0)
    if word_count >= 1200:
        score += 2.0
    elif word_count >= 1000:
        score += 1.8
    elif word_count >= 800:
        score += 1.5
    elif word_count >= 600:
        score += 1.0
    elif word_count >= 400:
        score += 0.5

    # 3. Heading structure (max 2.5)
    h1_count = len(re.findall(r'^#\s+', content, re.MULTILINE))
    h2_count = len(re.findall(r'^##\s+', content, re.MULTILINE))

    if h1_count == 1:
        score += 1.0
    elif h1_count > 1:
        score += 0.5

    if h2_count >= 2:
        score += 1.0
    elif h2_count == 1:
        score += 0.5

    all_headings = re.findall(r'^#{1,3}\s+(.+)$', content, re.MULTILINE)
    headings_text = " ".join(all_headings).lower()
    if any(str(kw).lower() in headings_text for kw in safe_keywords if len(str(kw)) > 2):
        score += 0.5

    # 4. Keyword optimization (max 3.0)
    kw_pattern = re.compile(r'\b' + re.escape(main_kw) + r'\b', re.IGNORECASE)
    kw_count = len(kw_pattern.findall(content_lower))

    if word_count > 0:
        density = (kw_count / word_count) * 100
        if 0.8 <= density <= 2.5:
            score += 2.0
        elif 0.5 <= density < 0.8 or 2.5 < density <= 3.5:
            score += 1.0
        elif density > 0:
            score += 0.5

        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        if paragraphs and main_kw in paragraphs[0].lower():
            score += 0.5
        if paragraphs and len(paragraphs) > 1 and main_kw in paragraphs[-1].lower():
            score += 0.5

    # 5. Content quality (max 2.0)
    paragraphs = [p for p in content.split('\n\n') if p.strip()]
    if len(paragraphs) >= 5:
        score += 0.5
    if len(paragraphs) >= 8:
        score += 0.5

    list_items = len(re.findall(r'^[\s]*[-*+]\s+', content, re.MULTILINE))
    if list_items >= 2:
        score += 0.5

    if re.search(r'!\[.*?\]\(.*?\)', content):
        score += 0.5

    if re.search(r'\[.*?\]\(https?://|https?://\S+', content):
        score += 0.5

    final_score = min(round(score, 1), max_score)

    # Gentle baseline so short-but-decent blogs aren't punished too hard
    if final_score < 6.0 and word_count > 0:
        baseline = min(6.0, 1.0 + (word_count / 1000))
        final_score = max(final_score, baseline)

    return final_score


def generate_meta_description(content: str, max_length: int = 160) -> str:
    """Generate an SEO-friendly meta description from the first meaningful paragraph."""
    clean_content = re.sub(r'[#*`_\-\[\]]', '', content)

    paragraphs = [p.strip() for p in clean_content.split('\n\n') if p.strip()]
    if not paragraphs:
        return ""

    first_para = paragraphs[0]

    if len(first_para) <= max_length:
        return first_para

    truncated = first_para[:max_length]
    last_space = truncated.rfind(' ')
    last_period = truncated.rfind('.')

    if last_period > max_length * 0.6:
        return truncated[:last_period + 1]
    elif last_space > max_length * 0.7:
        return truncated[:last_space].strip() + '...'

    return truncated.strip() + '...'


# ----------------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------------
@app.post("/generate-blog")
@safe_iteration_handler
async def generate_blog(request: Request):
    try:
        form = await request.form()
        logger.info("Received /generate-blog request (multipart)")

        # Parse form fields
        topic = form.get("topic", "Default Topic")
        company_name = form.get("company_name", "")
        word_count = int(form.get("word_count", 800))
        tone = form.get("tone", "professional")
        language = form.get("language", "English")
        additional_details: str = form.get("additional_details", "")
        sample_blog = form.get("sample_blog")
        company_url = form.get("company_url")
        user_id = form.get("user_id")

        raw_keywords = form.get("keywords")
        keywords = safe_ensure_list(raw_keywords)

        template = form.get("template")
        template_str = None
        if template:
            logger.info(f"Template received: {type(template)}")
            try:
                template_str = str(template)
            except Exception as e:
                logger.warning(f"Template conversion failed: {e}")
                template_str = None

        reference_image: UploadFile | None = form.get("reference_image")

        # Build the user prompt
        prompt = TEMPLATE_PROMPT.format(
            topic=topic,
            company_name=company_name or " ",
            word_count=word_count,
            template=template,
            tone=tone,
            language=language,
            keywords=", ".join(keywords) if keywords else "relevant terms",
            additional_details=additional_details,
        )

        if sample_blog:
            prompt += f"\n\nMatch this writing style:\n{sample_blog[:1500]}"
        if company_url:
            scraped = scrape_content_from_url(company_url)
            if scraped:
                prompt += f"\n\nUse this as reference:\n{scraped}"
        if template_str:
            prompt += f"\n\nUse this writing template for style reference:\n{template_str}"

        if reference_image is not None and reference_image.filename:
            prompt += (
                "\n\nThe user also provided a reference image for this blog. "
                "Carefully infer the theme, context, or mood from the image and "
                "align the blog’s examples, metaphors, and descriptions with what "
                "you understand from that image. Do NOT describe the image literally; "
                "use it as inspiration for tone, scenarios, or visuals in the content."
            )

        if not client:
            raise HTTPException(status_code=500, detail="Gemini client not configured")

        # Build Gemini contents payload
        contents_payload: list = [prompt]

        if reference_image is not None and reference_image.filename:
            try:
                img_bytes = await reference_image.read()
                contents_payload.append(
                    types.Part.from_bytes(
                        data=img_bytes,
                        mime_type=reference_image.content_type or "image/jpeg",
                    )
                )
                logger.info("Attached reference image (%s, %d bytes)",
                            reference_image.content_type, len(img_bytes))
            except Exception as e:
                logger.warning(f"Failed to attach reference image: {e}")

        # Gemini call
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_MESSAGE,
            temperature=1.0,
            top_p=0.8,
        )

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=contents_payload,
            config=config,
        )

        # Extract text (Gemini shape — no .choices)
        generated_text = (response.text or "").strip()
        if not generated_text:
            raise HTTPException(status_code=500, detail="Gemini returned empty content")

        logger.info("Generated text length: %d", len(generated_text))

        # Extract title from the first H1
        match = re.search(r"^#\s+(.*)", generated_text, re.MULTILINE)
        if match:
            title = match.group(1).strip()
            content = re.sub(
                r"^#\s+.*\n", "", generated_text, count=1, flags=re.MULTILINE
            ).strip()
        else:
            title = topic
            content = generated_text

        seo_score = calculate_seo_score(title, content, keywords)
        meta_description = generate_meta_description(content)
        word_count_calc = len(content.split())

        blog_data = {
            "title": title,
            "topic": topic,
            "content": content,
            "word_count": word_count_calc,
            "seo_score": round(seo_score),
            "meta_description": meta_description,
            "keywords_used": keywords,
            "template": "general",
            "tone": tone,
            "language": language,
            "company_name": company_name,
            "status": "published",
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
        }

        # Persist to Supabase if available
        if supabase:
            try:
                res = supabase.table("blogs").insert(blog_data).execute()
                if res and hasattr(res, 'data') and isinstance(res.data, list) and len(res.data) > 0:
                    row = res.data[0]
                    logger.info("Blog saved to Supabase: %s", row.get("id", "?"))
                else:
                    logger.warning("Supabase returned empty data, using local blog data")
                    row = blog_data
            except Exception as db_error:
                logger.error("Supabase error: %s", db_error)
                row = blog_data
        else:
            logger.warning("Supabase not available, returning blog without save")
            row = blog_data

        return row

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error in /generate-blog")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/blogs/{blog_id}")
async def get_blog(blog_id: str, user_id: str = None):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not available")

        query = supabase.table("blogs").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.eq("id", blog_id).maybe_single().execute()

        if not res or not hasattr(res, 'data') or not res.data:
            raise HTTPException(status_code=404, detail="Blog not found")
        return res.data
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in /blogs/{id}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/scrape-content")
async def scrape_content(request: Request):
    try:
        data = await request.json()
        url = data.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="URL required")

        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.content, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        title = soup.find("title").get_text() if soup.find("title") else ""
        content = "\n".join(
            line.strip() for line in soup.get_text().splitlines() if line.strip()
        )

        links = []
        images = []
        try:
            links = [a["href"] for a in soup.find_all("a", href=True)][:20]
        except Exception as e:
            logger.warning(f"Error extracting links: {e}")

        try:
            images = [img["src"] for img in soup.find_all("img", src=True)][:10]
        except Exception as e:
            logger.warning(f"Error extracting images: {e}")

        return {
            "url": url,
            "title": title,
            "content": content[:2000],
            "links": links,
            "images": images,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in /scrape-content")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)