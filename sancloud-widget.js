/**
 * Sand Cloud Chat Widget
 * n8n Chatbot Integration with Streaming Support
 */

class SandCloudChatWidget {
  constructor() {
    this.isOpen = false;
    this.isLoading = false;
    this.sessionId = null;
    this.webhookUrl = window.SandCloudChat?.webhookUrl || "";
    this.logoUrl =
      window.SandCloudChat?.logoUrl ||
      "https://postscript-mms-files.s3.amazonaws.com/1STOnZ-2uQqgT5sXKVkDpCKEJ665g.png";
    this.welcomeMessage =
      window.SandCloudChat?.welcomeMessage || "Hi! I'm here to assist you.";
    this.emojiList = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
    ];

    this.init();
  }

  init() {
    this.createWidget();
    this.loadSession();
    this.bindEvents();
    this.createMenuPopover();
    this.addWelcomeMessage();
  }

  createWidget() {
    // Create toggle button
    this.toggleButton = document.createElement("button");
    this.toggleButton.className = "sancloud-chat-toggle";
    this.toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M132,24A100.11,100.11,0,0,0,32,124v84a16,16,0,0,0,16,16h84a100,100,0,0,0,0-200Zm0,184H48V124a84,84,0,1,1,84,84Zm12-80a12,12,0,1,1-12-12A12,12,0,0,1,144,128Zm-44,0a12,12,0,1,1-12-12A12,12,0,0,1,100,128Zm88,0a12,12,0,1,1-12-12A12,12,0,0,1,188,128Z"></path></svg>`;
    this.toggleButton.setAttribute("aria-label", "Open chat");

    // Create chat window
    this.chatWindow = document.createElement("div");
    this.chatWindow.className = "sancloud-chat-window";
    this.chatWindow.innerHTML = `
        <div class="sancloud-chat-header">
          <button class="sancloud-chat-menu" id="chat-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#92919B" viewBox="0 0 256 256"><path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM128,76a28,28,0,1,0-28-28A28,28,0,0,0,128,76Zm0,104a28,28,0,1,0,28,28A28,28,0,0,0,128,180Z"></path></svg></button>
          <div class="sancloud-chat-brand">
            <div class="sancloud-chat-logo" id="chat-logo">
              <img src="${this.logoUrl}" alt="Sand Cloud" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
          </div>
          <button class="sancloud-chat-minimize" id="chat-new-session" aria-label="Start new chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#92919B" viewBox="0 0 256 256"><path d="M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z"></path></svg>
          </button>
          <button class="sancloud-chat-minimize" id="chat-minimize">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#92919B" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
          </button>
        </div>
        <div class="sancloud-chat-messages" id="chat-messages"></div>
        <div class="sancloud-chat-input-area">
          <textarea class="sancloud-chat-input" id="chat-input" placeholder="Type your message..." ></textarea>
          <div class="sancloud-chat-buttons">
          <div class="sancloud-chat-buttons-left">
          <button class="sancloud-chat-attachment" id="chat-attachment" title="Attach file">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#92919B" viewBox="0 0 256 256"><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path></svg>
          </button>
          <button class="sancloud-chat-emoji" id="chat-emoji" title="Add emoji">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#92919B" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg>
          </button>
          </div>

            <button class="sancloud-chat-send" id="chat-send">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"></path></svg>
            </button>
          </div>
        </div>
        <div class="sancloud-emoji-picker" id="emoji-picker">
          <div class="sancloud-emoji-grid" id="emoji-grid"></div>
        </div>
      `;

    // Add to DOM
    document.body.appendChild(this.toggleButton);
    document.body.appendChild(this.chatWindow);

    // Set logo
    this.setLogo();
  }

  setLogo() {
    const logoElement = document.getElementById("chat-logo");
    if (this.logoUrl && this.logoUrl !== this.createPlaceholderLogo()) {
      logoElement.innerHTML = `<img src="${this.logoUrl}" alt="Sand Cloud" style="width: 100%; height: 100%; object-fit: contain;" />`;
    }
  }

  createPlaceholderLogo() {
    // Create SVG placeholder
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#98dbce"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">SC</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  bindEvents() {
    // Toggle button
    this.toggleButton.addEventListener("click", () => this.toggleChat());

    // Menu button -> toggle popover
    const menuButton = document.getElementById("chat-menu");
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMenuPopover();
    });

    // Close popover on outside click
    document.addEventListener("click", (e) => {
      if (this.menuPopover && this.menuPopover.style.display === "block") {
        if (
          !this.menuPopover.contains(e.target) &&
          !menuButton.contains(e.target)
        ) {
          this.hideMenuPopover();
        }
      }
    });

    // Close popover on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideMenuPopover();
      }
    });

    // Minimize button
    document
      .getElementById("chat-minimize")
      .addEventListener("click", () => this.closeChat());

    // New chat button
    document
      .getElementById("chat-new-session")
      .addEventListener("click", () => this.restartChatSession());

    // Send button and Enter key
    const sendButton = document.getElementById("chat-send");
    const input = document.getElementById("chat-input");

    sendButton.addEventListener("click", () => {
      if (!this.isLoading) {
        this.sendMessage();
      }
    });
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !this.isLoading) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener("input", () => this.autoResizeTextarea(input));

    // Emoji picker
    const emojiButton = document.getElementById("chat-emoji");
    const emojiPicker = document.getElementById("emoji-picker");

    emojiButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleEmojiPicker();
    });

    // Close emoji picker when clicking outside
    document.addEventListener("click", (e) => {
      if (!emojiPicker.contains(e.target) && !emojiButton.contains(e.target)) {
        emojiPicker.classList.remove("show");
      }
    });

    // Attachment button (placeholder)
    document.getElementById("chat-attachment").addEventListener("click", () => {
      this.showAttachmentPlaceholder();
    });

    // Populate emoji grid
    this.populateEmojiGrid();
  }

  populateEmojiGrid() {
    const emojiGrid = document.getElementById("emoji-grid");
    emojiGrid.innerHTML = "";

    this.emojiList.forEach((emoji) => {
      const emojiItem = document.createElement("div");
      emojiItem.className = "sancloud-emoji-item";
      emojiItem.textContent = emoji;
      emojiItem.addEventListener("click", () => this.insertEmoji(emoji));
      emojiGrid.appendChild(emojiItem);
    });
  }

  insertEmoji(emoji) {
    const input = document.getElementById("chat-input");
    input.value += emoji;
    input.focus();
    this.autoResizeTextarea(input);
    document.getElementById("emoji-picker").classList.remove("show");
  }

  autoResizeTextarea(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the new height based on content
    const newHeight = Math.max(24, textarea.scrollHeight);

    // Set the new height, but don't exceed max-height
    textarea.style.height = Math.min(newHeight, 128) + "px";
  }

  toggleEmojiPicker() {
    const emojiPicker = document.getElementById("emoji-picker");
    emojiPicker.classList.toggle("show");
  }

  createMenuPopover() {
    // Create popover container
    this.menuPopover = document.createElement("div");
    this.menuPopover.id = "chat-menu-popover";
    this.menuPopover.setAttribute("role", "menu");
    this.menuPopover.className = "sancloud-menu-popover";

    // Build menu items
    const endBtn = document.createElement("button");
    endBtn.type = "button";
    endBtn.textContent = "Clear chat";
    endBtn.className = "sancloud-menu-item";
    endBtn.addEventListener("click", () => {
      this.endChatSession();
      this.hideMenuPopover();
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.textContent = "Download transcript";
    downloadBtn.className = "sancloud-menu-item";
    downloadBtn.addEventListener("click", () => {
      this.downloadTranscript();
      this.hideMenuPopover();
    });

    this.menuPopover.appendChild(endBtn);
    this.menuPopover.appendChild(downloadBtn);

    // Append to chat window so it's positioned correctly relative to it
    this.chatWindow.appendChild(this.menuPopover);
  }

  toggleMenuPopover() {
    if (!this.menuPopover) return;
    const isShown = this.menuPopover.classList.contains("show");
    if (isShown) {
      this.menuPopover.classList.remove("show");
      return;
    }

    // Position popover under the menu button inside the chat window
    const menuButton = document.getElementById("chat-menu");
    const header = this.chatWindow.querySelector(".sancloud-chat-header");
    if (menuButton && header) {
      const headerRect = header.getBoundingClientRect();
      const btnRect = menuButton.getBoundingClientRect();
      const top = btnRect.bottom - headerRect.top + 8; // gap below button
      const left = btnRect.left - headerRect.left; // align left
      this.menuPopover.style.top = `${top}px`;
      this.menuPopover.style.left = `${left}px`;
    }

    this.menuPopover.classList.add("show");
  }

  hideMenuPopover() {
    if (this.menuPopover) {
      this.menuPopover.classList.remove("show");
    }
  }

  endChatSession() {
    // Clear session id and stored session
    try {
      localStorage.removeItem("sandcloud-chat-session");
    } catch (_) {}
    this.sessionId = null;

    // Clear messages
    const messagesContainer = document.getElementById("chat-messages");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
    }

    // Optionally show a fresh welcome message after ending chat
    this.addWelcomeMessage();
  }

  restartChatSession() {
    // Clear current chat and session, then focus input for a fresh start
    this.endChatSession();
    const input = document.getElementById("chat-input");
    if (input) {
      input.focus();
    }
  }

  downloadTranscript() {
    const messagesContainer = document.getElementById("chat-messages");
    if (!messagesContainer) return;

    const lines = [];
    const nodes = messagesContainer.querySelectorAll(".sancloud-chat-message");
    nodes.forEach((node) => {
      const isBot = node.classList.contains("bot");
      const isCustomer = node.classList.contains("customer");
      // Extract text content to avoid HTML/markdown
      const text = node.textContent || "";
      const prefix = isCustomer ? "You:" : isBot ? "Bot:" : "";
      lines.push(prefix ? `${prefix} ${text}` : text);
    });

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `sancloud-chat-transcript-${ts}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showAttachmentPlaceholder() {
    this.addMessage("bot", "File attachment feature coming soon! 📎", true);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.chatWindow.classList.add("open");
      this.toggleButton.style.display = "none";
      document.getElementById("chat-input").focus();
    } else {
      this.chatWindow.classList.remove("open");
      this.toggleButton.style.display = "flex";
    }
  }

  closeChat() {
    this.isOpen = false;
    this.chatWindow.classList.remove("open");
    this.toggleButton.style.display = "flex";
  }

  addWelcomeMessage() {
    const messagesContainer = document.getElementById("chat-messages");
    const welcomeDiv = document.createElement("div");
    welcomeDiv.className = "sancloud-chat-message bot";
    welcomeDiv.textContent = this.welcomeMessage;
    messagesContainer.appendChild(welcomeDiv);
  }

  addMessage(sender, content, isSystem = false) {
    const messagesContainer = document.getElementById("chat-messages");

    if (isSystem) {
      const systemDiv = document.createElement("div");
      systemDiv.className = "sancloud-chat-message bot";
      // Parse and sanitize Markdown content
      systemDiv.innerHTML = this.parseMarkdown(content);
      messagesContainer.appendChild(systemDiv);
    } else {
      const messageDiv = document.createElement("div");
      messageDiv.className = `sancloud-chat-message ${sender}`;
      // Parse and sanitize Markdown content
      messageDiv.innerHTML = this.parseMarkdown(content);
      messagesContainer.appendChild(messageDiv);
    }

    this.scrollToBottom();
  }

  parseMarkdown(content) {
    try {
      // Parse Markdown to HTML
      const html = marked.parse(content);
      // Sanitize the HTML to prevent XSS
      const sanitized = DOMPurify.sanitize(html);
      return sanitized;
    } catch (error) {
      console.error("Error parsing Markdown:", error);
    }
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById("chat-messages");

    // Remove existing typing indicator
    const existingTyping = messagesContainer.querySelector(
      ".sancloud-typing-indicator"
    );
    if (existingTyping) {
      existingTyping.remove();
    }

    const typingDiv = document.createElement("div");
    typingDiv.className = "sancloud-typing-indicator";
    typingDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.41A56.09,56.09,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.67,86.27,8,8,0,0,0,56,78.73V72a32,32,0,0,1,64,0v68.26A47.8,47.8,0,0,0,88,128a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,1,1,168,144a8,8,0,0,0,0-16,47.8,47.8,0,0,0-32,12.26V72a32,32,0,0,1,64,0v6.73a8,8,0,0,0,5.33,7.54A40,40,0,0,1,192,164Zm16-52a8,8,0,0,1-8,8h-4a36,36,0,0,1-36-36V80a8,8,0,0,1,16,0v4a20,20,0,0,0,20,20h4A8,8,0,0,1,208,112ZM60,120H56a8,8,0,0,1,0-16h4A20,20,0,0,0,80,84V80a8,8,0,0,1,16,0v4A36,36,0,0,1,60,120Z"></path></svg>
      <span>Thinking...</span>
      <div class="sancloud-typing-dots">
        <div class="sancloud-typing-dot"></div>
        <div class="sancloud-typing-dot"></div>
        <div class="sancloud-typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.querySelector(
      ".sancloud-typing-indicator"
    );
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById("chat-messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (!message || this.isLoading) return;

    // Add user message
    this.addMessage("customer", message);
    input.value = "";

    // Reset textarea height
    this.autoResizeTextarea(input);

    // Show typing indicator
    this.showTypingIndicator();
    this.setLoading(true);

    try {
      await this.sendToWebhook(message);
    } catch (error) {
      console.error("Error sending message:", error);
      this.hideTypingIndicator();
      this.addMessage(
        "bot",
        "Sorry, I encountered an error. Please try again.",
        true
      );
    } finally {
      this.setLoading(false);
    }
  }

  async sendToWebhook(message) {
    const payload = {
      chatInput: message,
      sessionId: this.sessionId,
    };

    console.log("Sending payload to webhook:", payload);

    const response = await fetch(this.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Webhook response status:", response.status);
    console.log(
      "Webhook response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle streaming response
    await this.handleStreamingResponse(response);
  }

  async handleStreamingResponse(response) {
    this.hideTypingIndicator();

    // Check if response is streaming
    const contentType = response.headers.get("content-type") || "";
    const isStreaming =
      contentType.includes("text/event-stream") ||
      contentType.includes("application/x-ndjson") ||
      contentType.includes("application/json") || // n8n might use regular JSON for streaming
      response.headers.get("transfer-encoding") === "chunked";

    // Create bot message container
    const messagesContainer = document.getElementById("chat-messages");
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "sancloud-chat-message bot";

    // Add blinking dot while waiting for content
    botMessageDiv.innerHTML = '<span class="sancloud-blinking-dot">●</span>';
    messagesContainer.appendChild(botMessageDiv);
    this.scrollToBottom();

    // Store reference for content accumulation
    botMessageDiv._accumulatedContent = "";

    // Flag to prevent double processing
    let responseProcessed = false;

    if (isStreaming) {
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                // Handle session ID
                if (data.sessionId && !this.sessionId) {
                  this.sessionId = data.sessionId;
                  this.saveSession();
                }

                // Handle n8n streaming format
                if (data.type === "item" && data.content) {
                  // Accumulate content during streaming
                  botMessageDiv._accumulatedContent += data.content;

                  // Show raw content during streaming (no parsing yet)
                  if (
                    botMessageDiv.innerHTML.includes("sancloud-blinking-dot")
                  ) {
                    botMessageDiv.textContent = data.content;
                  } else {
                    botMessageDiv.textContent += data.content;
                  }
                  this.scrollToBottom();
                  responseProcessed = true;
                } else if (data.type === "begin") {
                  // Stream started - keep blinking dot for now
                  responseProcessed = true;
                } else if (data.type === "end") {
                  // Stream ended - parse accumulated content
                  console.log("Stream ended");
                  if (botMessageDiv._accumulatedContent) {
                    botMessageDiv.innerHTML = this.parseMarkdown(
                      botMessageDiv._accumulatedContent
                    );
                  }
                  responseProcessed = true;
                  break;
                } else {
                  // Handle legacy message content (only if not n8n format)
                  if (data.message || data.text || data.content) {
                    const content = data.message || data.text || data.content;
                    // Accumulate content during streaming
                    botMessageDiv._accumulatedContent += content;

                    // Show raw content during streaming (no parsing yet)
                    if (
                      botMessageDiv.innerHTML.includes("sancloud-blinking-dot")
                    ) {
                      botMessageDiv.textContent = content;
                    } else {
                      botMessageDiv.textContent += content;
                    }
                    this.scrollToBottom();
                    responseProcessed = true;
                  }
                }

                // Handle end of stream
                if (data.done || data.finished) {
                  // Parse accumulated content when stream ends
                  if (botMessageDiv._accumulatedContent) {
                    botMessageDiv.innerHTML = this.parseMarkdown(
                      botMessageDiv._accumulatedContent
                    );
                  }
                  break;
                }
              } catch (e) {
                // If not JSON, treat as plain text
                if (line.trim()) {
                  botMessageDiv.textContent += line;
                  this.scrollToBottom();
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        botMessageDiv.textContent =
          "Sorry, I encountered an error processing your message.";
      } finally {
        reader.releaseLock();
      }
    } else {
      // Handle non-streaming JSON response
      try {
        const data = await response.json();
        console.log("Webhook response data:", data);

        // Handle session ID
        if (data.sessionId && !this.sessionId) {
          this.sessionId = data.sessionId;
          this.saveSession();
        }

        // Handle different response formats
        if (data.message || data.text || data.content || data.response) {
          const content =
            data.message || data.text || data.content || data.response;
          // Parse and display content immediately for non-streaming responses
          if (botMessageDiv.innerHTML.includes("sancloud-blinking-dot")) {
            botMessageDiv.innerHTML = this.parseMarkdown(content);
          } else {
            botMessageDiv.innerHTML = this.parseMarkdown(content);
          }
          responseProcessed = true;
        } else if (data.executionStarted) {
          // n8n execution started - this means the workflow is running
          botMessageDiv.textContent =
            "I received your message and I'm processing it. Please wait a moment...";

          // For now, show a helpful response since the workflow isn't returning chat content
          setTimeout(() => {
            this.showHelpfulResponse(data.executionId);
          }, 1500);
          responseProcessed = true;
        } else {
          // Fallback response
          botMessageDiv.innerHTML = this.parseMarkdown(
            "I received your message. How can I help you further?"
          );
          responseProcessed = true;
        }

        this.scrollToBottom();
      } catch (error) {
        console.error("Error parsing response:", error);
        // Try to handle as text stream if JSON parsing fails
        try {
          const text = await response.text();
          console.log("Response as text:", text);

          // Check if it's n8n streaming format
          if (text.includes('"type":"item"')) {
            this.handleN8nStreamingText(text, botMessageDiv);
            responseProcessed = true;
          } else {
            // Only set text content if we haven't already processed it
            if (
              !responseProcessed &&
              (!botMessageDiv.textContent ||
                botMessageDiv.textContent.trim() === "")
            ) {
              // Parse and display content immediately for non-streaming responses
              if (botMessageDiv.innerHTML.includes("sancloud-blinking-dot")) {
                botMessageDiv.innerHTML = this.parseMarkdown(
                  text || "I received your message. How can I help you further?"
                );
              } else {
                botMessageDiv.innerHTML = this.parseMarkdown(
                  text || "I received your message. How can I help you further?"
                );
              }
              responseProcessed = true;
            }
          }
        } catch (textError) {
          console.error("Error parsing as text:", textError);
          if (
            !responseProcessed &&
            (!botMessageDiv.textContent ||
              botMessageDiv.textContent.trim() === "")
          ) {
            botMessageDiv.innerHTML = this.parseMarkdown(
              "Sorry, I encountered an error processing your message."
            );
            responseProcessed = true;
          }
        }
      }
    }
  }

  handleN8nStreamingText(text, botMessageDiv) {
    console.log("Handling n8n streaming text format");

    // Split by newlines and process each JSON object
    const lines = text.split("\n").filter((line) => line.trim());
    let fullMessage = "";

    for (const line of lines) {
      try {
        const data = JSON.parse(line);

        if (data.type === "item" && data.content) {
          fullMessage += data.content;
        } else if (data.type === "begin") {
          fullMessage = "";
        } else if (data.type === "end") {
          break;
        }
      } catch (e) {
        console.warn("Failed to parse line:", line);
      }
    }

    // Parse and display the complete message
    if (botMessageDiv.innerHTML.includes("sancloud-blinking-dot")) {
      botMessageDiv.innerHTML = this.parseMarkdown(fullMessage);
    } else {
      botMessageDiv.innerHTML = this.parseMarkdown(fullMessage);
    }
    this.scrollToBottom();
  }

  showHelpfulResponse(executionId) {
    console.log(`Showing helpful response for execution ${executionId}`);

    const messagesContainer = document.getElementById("chat-messages");
    const lastBotMessage = messagesContainer.querySelector(
      ".sancloud-chat-message.bot:last-child"
    );

    if (lastBotMessage && lastBotMessage.textContent.includes("processing")) {
      // Show a more helpful response based on common queries
      const helpfulResponses = [
        "Hi! I'm here to help with questions about Sand Cloud products, orders, shipping, and returns. What can I assist you with today?",
        "Hello! I can help you with order tracking, product information, shipping questions, or returns. What would you like to know?",
        "Hi there! I'm your Sand Cloud assistant. I can help with orders, products, shipping, returns, or any other questions you might have. How can I help you today?",
        "Welcome! I'm here to assist with Sand Cloud orders, products, shipping, returns, and more. What can I help you with?",
      ];

      const randomResponse =
        helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)];
      lastBotMessage.innerHTML = this.parseMarkdown(randomResponse);
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    const sendButton = document.getElementById("chat-send");
    const input = document.getElementById("chat-input");

    if (loading) {
      // Only disable send button, keep input enabled
      sendButton.disabled = true;
      sendButton.style.opacity = "0.5";
      sendButton.style.cursor = "not-allowed";
    } else {
      // Re-enable send button
      sendButton.disabled = false;
      sendButton.style.opacity = "1";
      sendButton.style.cursor = "pointer";
      input.focus();
    }
  }

  loadSession() {
    try {
      const savedSession = localStorage.getItem("sandcloud-chat-session");
      if (savedSession) {
        this.sessionId = savedSession;
      }
    } catch (error) {
      console.warn("Could not load session from localStorage:", error);
    }
  }

  saveSession() {
    try {
      if (this.sessionId) {
        localStorage.setItem("sandcloud-chat-session", this.sessionId);
      }
    } catch (error) {
      console.warn("Could not save session to localStorage:", error);
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.sandCloudWidget = new SandCloudChatWidget();
  });
} else {
  window.sandCloudWidget = new SandCloudChatWidget();
}
