# Sand Cloud Chat Widget

## Installation

### 1. Add to Your Website

Add this code before the closing `</body>` tag:

```html
<!-- Sand Cloud Chat Widget -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ivsmani/scw/sancloud-widget.min.css" />
<script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
<script src="https://unpkg.com/dompurify@3.0.6/dist/purify.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ivsmani/scw/sancloud-widget.min.js"></script>
```

### 2. Configure

```html
<script>
  window.SandCloudChat = {
    logoUrl: "https://your-domain.com/logo.png", // Optional
    webhookUrl: "https://your-webhook-url.com/chat",
  };
</script>
<script src="path/to/sancloud-widget.js"></script>
```

That's it! The widget will appear on your website.
