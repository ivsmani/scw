# Sand Cloud Chat Widget

A modern chat widget with Markdown support for any website.

## Installation

### 1. Download Files

Download these files to your website:

- `sancloud-widget.js`
- `sancloud-widget.css`

### 2. Add to Your Website

Add this code before the closing `</body>` tag:

```html
<!-- Sand Cloud Chat Widget -->
<link rel="stylesheet" href="path/to/sancloud-widget.css" />
<script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
<script src="https://unpkg.com/dompurify@3.0.6/dist/purify.min.js"></script>
<script src="path/to/sancloud-widget.js"></script>
```

### 3. Configure (Optional)

```html
<script>
  window.SandCloudChat = {
    logoUrl: "https://your-domain.com/logo.png",
    webhookUrl: "https://your-webhook-url.com/chat",
  };
</script>
<script src="path/to/sancloud-widget.js"></script>
```

That's it! The widget will automatically appear on your website.
