"""Each toolkit's own look: colours and a background pattern, in the Apple style.

Every tool page gets `class="tool-identity"`, a `data-look` pattern and three colours
(--t1, --t2, --t3) on <body>; assets/tool-identity.css turns these into the hero,
background art, buttons and accents. A tool that is not listed below (a new toolkit)
gets its own colours and pattern worked out from its name, so it is unique too.
"""
import colorsys, hashlib, re

LOOKS = ['aurora', 'mesh', 'rings', 'grid', 'waves', 'dots', 'beams', 'prism', 'halo', 'ribbons']

# slug: (look, colour 1, colour 2, colour 3)
THEMES = {
    'corpus-toolkit':       ('aurora',  '#0a8f7a', '#34c3a0', '#0071e3'),
    'stylistic-toolkit':    ('prism',   '#8e44ec', '#ff5fa2', '#5b5bd6'),
    'corpus-cleaner':       ('waves',   '#1fa463', '#8bdc65', '#00a5b5'),
    'file-converter':       ('beams',   '#4f46e5', '#22b8cf', '#a78bfa'),
    'subtitle-corpus':      ('ribbons', '#ff453a', '#ff9f0a', '#ff2d55'),
    'corpus-merger':        ('rings',   '#e08a00', '#ffcc00', '#ff7a45'),
    'english-ocr':          ('grid',    '#0a84ff', '#64d2ff', '#5e5ce6'),
    'pdf-tools':            ('halo',    '#e0245e', '#ff6b6b', '#8e2de2'),
    'image-tools':          ('mesh',    '#d63384', '#ff8fab', '#ffb86b'),
    'metadata-studio':      ('grid',    '#0f9d8a', '#2dd4bf', '#475569'),
    'lexical-metrics':      ('dots',    '#2563eb', '#60a5fa', '#7c3aed'),
    'morphology-explorer':  ('rings',   '#7c3aed', '#c084fc', '#f472b6'),
    'syntax-explorer':      ('beams',   '#0891b2', '#22d3ee', '#14b8a6'),
    'sentiment-studio':     ('aurora',  '#ff7a00', '#ff2d55', '#ffd60a'),
    'register-profile':     ('waves',   '#4d9a2a', '#a3d95b', '#2f855a'),
    'forensic-compare':     ('grid',    '#334155', '#3b82f6', '#94a3b8'),
    'readability-studio':   ('halo',    '#f59e0b', '#fbbf24', '#ef4444'),
    'stylometry-lab':       ('prism',   '#4338ca', '#818cf8', '#06b6d4'),
    'parallel-aligner':     ('ribbons', '#059669', '#34d399', '#0ea5e9'),
    'qualitative-coder':    ('dots',    '#db2777', '#f472b6', '#a855f7'),
    'grammar-checker':      ('mesh',    '#16a34a', '#4ade80', '#0ea5e9'),
    'ai-text-detector':     ('beams',   '#7c3aed', '#a855f7', '#06b6d4'),
    'text-humanizer':       ('aurora',  '#0a7ea4', '#2dd4bf', '#f59e0b'),
    'image-converter':      ('mesh',    '#0ea5e9', '#84cc16', '#22d3ee'),
    'image-resizer':        ('rings',   '#65a30d', '#a3e635', '#10b981'),
    'passport-photo-maker': ('halo',    '#ea580c', '#fdba74', '#f43f5e'),
    'text-to-speech':       ('waves',   '#8b5cf6', '#ec4899', '#38bdf8'),
    'citation-generator':   ('grid',    '#b45309', '#f59e0b', '#78716c'),
    'synonym-explorer':     ('dots',    '#6366f1', '#a5b4fc', '#ec4899'),
    'text-statistics':      ('beams',   '#059669', '#10b981', '#3b82f6'),
    'case-converter':       ('ribbons', '#9333ea', '#e879f9', '#6366f1'),
}

# Pages that are not workspaces keep the site look.
SKIP = {'mat-cleaner', 'pmc'}


def _hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h % 1.0, l, s)
    return '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))


def theme_for(slug):
    """The tool's look; new tools get colours and a pattern derived from their name."""
    if slug in THEMES:
        return THEMES[slug]
    d = hashlib.sha256(slug.encode('utf-8')).digest()
    hue = d[0] / 255.0
    look = LOOKS[d[1] % len(LOOKS)]
    spread = 0.08 + (d[2] / 255.0) * 0.12      # 30-72 degrees to the second colour
    return (look,
            _hex(hue, 0.78, 0.45),
            _hex(hue + spread, 0.85, 0.60),
            _hex(hue - spread * 1.6, 0.70, 0.52))


def add_identity(text, route, slugs):
    slug = route.split('/')[0]
    if route != slug + '/index.html' or slug not in slugs or slug in SKIP or 'tool-identity' in text:
        return text
    m = re.search(r'<body([^>]*)>', text)
    if not m:
        return text
    look, c1, c2, c3 = theme_for(slug)
    attrs = m.group(1)
    if 'class="' in attrs:
        attrs = attrs.replace('class="', 'class="tool-identity ', 1)
    else:
        attrs = ' class="tool-identity"' + attrs
    style = f'--t1:{c1};--t2:{c2};--t3:{c3}'
    if 'style="' in attrs:
        attrs = attrs.replace('style="', f'style="{style};', 1)
    else:
        attrs += f' style="{style}"'
    attrs += f' data-look="{look}"'
    text = text[:m.start()] + '<body' + attrs + '>' + text[m.end():]
    return text.replace('</head>', '<link rel="stylesheet" href="../assets/tool-identity.css"></head>', 1)


def add_card_identity(text, route):
    """Give each card on the Toolkits page its tool's colours (icon and glow)."""
    if route != 'toolkits/index.html':
        return text

    def card(m):
        slug, attrs = m.group(1), m.group(2)
        if slug in SKIP or '--t1:' in attrs:
            return m.group(0)
        _, c1, c2, c3 = theme_for(slug)
        vars_ = f'--t1:{c1};--t2:{c2};--t3:{c3};'
        if 'style="' in attrs:
            attrs = attrs.replace('style="', 'style="' + vars_, 1)
        else:
            attrs += f' style="{vars_}"'
        return f'<article class="toolkit-card" data-toolkit="{slug}"{attrs}>'
    return re.sub(r'<article class="toolkit-card" data-toolkit="([a-z0-9-]+)"([^>]*)>', card, text)
