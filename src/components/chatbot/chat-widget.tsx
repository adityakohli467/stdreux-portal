"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, ShoppingCart, Mail, Loader2, Bot, User, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { chatbotApi } from "@/lib/api"
import { useCartStore } from "@/store/cart"
import { useAuthStore } from "@/store/auth"
import { toast } from "sonner"

interface ProductSuggestion {
  product_id: number
  product_name: string
  quantity: number
  reason: string
  product_price: number
  product_image?: string
  estimated_total: number
  options?: Array<{
    option_id: number
    option_value_id: number
    option_name: string
    option_value: string
    option_price: string
    option_price_prefix: string
  }>
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  suggestions?: ProductSuggestion[] | null
  canAddToCart?: boolean
  followUpQuestions?: string[]
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your virtual catering manager. I can help you plan the perfect order for your event — whether it's a birthday, wedding, corporate meeting, or any gathering. What are you planning?",
      suggestions: null,
      canAddToCart: false,
      followUpQuestions: [
        "Planning a birthday party",
        "Corporate event catering",
        "Wedding reception",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [emailName, setEmailName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const addItem = useCartStore((state) => state.addItem)
  const user = useAuthStore((state) => state.user)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    setInput("")
    const userMessage: ChatMessage = { role: "user", content: messageText }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      // Build conversation history from messages (text only for API)
      const conversationHistory = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await chatbotApi.sendMessage(messageText, conversationHistory)
      const data = response.data

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
        suggestions: data.suggestions,
        canAddToCart: data.canAddToCart,
        followUpQuestions: data.followUpQuestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong. Please try again."
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm sorry, I had trouble processing that. ${errorMessage}`,
          suggestions: null,
          canAddToCart: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (suggestion: ProductSuggestion) => {
    addItem({
      product_id: suggestion.product_id,
      product_name: suggestion.product_name,
      product_price: suggestion.product_price.toString(),
      quantity: suggestion.quantity,
      product_image: suggestion.product_image || undefined,
      options: suggestion.options?.map((o) => ({
        option_id: o.option_id,
        option_name: o.option_name,
        option_value_id: o.option_value_id,
        option_value: o.option_value,
        product_option_id: o.option_id,
        option_price: o.option_price || "0",
        option_price_prefix: o.option_price_prefix || "+",
      })),
    })
    toast.success(`${suggestion.product_name} (x${suggestion.quantity}) added to cart!`)
  }

  const handleAddAllToCart = (suggestions: ProductSuggestion[]) => {
    suggestions.forEach((s) => {
      addItem({
        product_id: s.product_id,
        product_name: s.product_name,
        product_price: s.product_price.toString(),
        quantity: s.quantity,
        product_image: s.product_image || undefined,
        options: s.options?.map((o) => ({
          option_id: o.option_id,
          option_name: o.option_name,
          option_value_id: o.option_value_id,
          option_value: o.option_value,
          product_option_id: o.option_id,
          option_price: o.option_price || "0",
          option_price_prefix: o.option_price_prefix || "+",
        })),
      })
    })
    toast.success(`${suggestions.length} items added to cart!`)
  }

  const handleEmailQuote = async (suggestions: ProductSuggestion[]) => {
    const email = emailInput.trim() || user?.email
    if (!email) {
      setShowEmailForm(true)
      return
    }

    setEmailLoading(true)
    try {
      // Build event context from conversation
      const eventDetails = messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("; ")

      await chatbotApi.emailQuote({
        suggestions: suggestions.map((s) => ({
          product_id: s.product_id,
          product_name: s.product_name,
          quantity: s.quantity,
          product_price: s.product_price,
          estimated_total: s.estimated_total,
          options: s.options?.map((o) => ({
            option_id: o.option_id,
            option_value_id: o.option_value_id,
            option_name: o.option_name,
            option_value: o.option_value,
          })),
        })),
        customerEmail: email,
        customerName: emailName || user?.username || undefined,
        eventDetails,
      })

      toast.success("Quote sent to your email!")
      setShowEmailForm(false)
      setEmailInput("")
      setEmailName("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send quote email")
    } finally {
      setEmailLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Get the latest suggestions from messages
  const latestSuggestions = [...messages]
    .reverse()
    .find((m) => m.suggestions && m.suggestions.length > 0)?.suggestions

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#2952E6] hover:bg-[#1e3fb3] text-white rounded-full px-5 py-3.5 shadow-xl transition-all duration-300 hover:scale-105 group"
          aria-label="Open AI Catering Assistant"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Catering Assistant</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-[#2952E6] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-1.5">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Catering Manager</h3>
                <p className="text-xs text-blue-100">AI-powered event planning</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i}>
                {/* Message bubble */}
                <div className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2952E6] flex items-center justify-center mt-0.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#2952E6] text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center mt-0.5">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Product suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 ml-9 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recommended Items
                    </p>
                    {msg.suggestions.map((s, j) => (
                      <div
                        key={j}
                        className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Package className="h-3.5 w-3.5 text-[#2952E6] flex-shrink-0" />
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {s.product_name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Qty: {s.quantity} × ${s.product_price.toFixed(2)}</p>
                            {s.options && s.options.length > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {s.options.map((o) => `${o.option_name}: ${o.option_value}`).join(", ")}
                              </p>
                            )}
                            {s.reason && (
                              <p className="text-xs text-blue-600 mt-1 italic">{s.reason}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-sm font-bold text-gray-900">
                              ${s.estimated_total.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleAddToCart(s)}
                              className="flex items-center gap-1 text-xs bg-[#2952E6] hover:bg-[#1e3fb3] text-white px-2.5 py-1 rounded-lg transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Totals & action buttons */}
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-sm font-medium text-gray-700">Estimated Total</span>
                        <span className="text-lg font-bold text-[#2952E6]">
                          ${msg.suggestions.reduce((sum, s) => sum + s.estimated_total, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddAllToCart(msg.suggestions!)}
                          className="flex-1 bg-[#2952E6] hover:bg-[#1e3fb3] text-white text-xs h-9"
                          size="sm"
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                          Add All to Cart
                        </Button>
                        <Button
                          onClick={() => {
                            if (user?.email) {
                              handleEmailQuote(msg.suggestions!)
                            } else {
                              setShowEmailForm(true)
                            }
                          }}
                          variant="outline"
                          className="flex-1 text-xs h-9 border-[#2952E6] text-[#2952E6] hover:bg-blue-50"
                          size="sm"
                          disabled={emailLoading}
                        >
                          {emailLoading ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          ) : (
                            <Mail className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          Email Quote
                        </Button>
                      </div>

                      {/* Email form (shown when user not logged in) */}
                      {showEmailForm && (
                        <div className="mt-3 space-y-2 pt-3 border-t border-blue-200">
                          <Input
                            type="text"
                            placeholder="Your name"
                            value={emailName}
                            onChange={(e) => setEmailName(e.target.value)}
                            className="h-8 text-xs bg-white"
                          />
                          <Input
                            type="email"
                            placeholder="Your email address"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="h-8 text-xs bg-white"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEmailQuote(msg.suggestions!)}
                              className="flex-1 bg-[#2952E6] hover:bg-[#1e3fb3] text-white text-xs h-8"
                              size="sm"
                              disabled={!emailInput.trim() || emailLoading}
                            >
                              {emailLoading ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                "Send Quote"
                              )}
                            </Button>
                            <Button
                              onClick={() => setShowEmailForm(false)}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick question buttons */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && !loading && (
                  <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                    {msg.followUpQuestions.map((q, j) => (
                      <button
                        key={j}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs bg-white border border-gray-200 hover:border-[#2952E6] hover:text-[#2952E6] text-gray-600 rounded-full px-3 py-1.5 transition-colors shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2952E6] flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your event or ask a question..."
                className="flex-1 bg-gray-50 border-gray-200 text-sm h-10 rounded-xl"
                disabled={loading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="bg-[#2952E6] hover:bg-[#1e3fb3] text-white h-10 w-10 rounded-xl p-0"
                size="icon"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              AI-powered suggestions • Prices may vary
            </p>
          </div>
        </div>
      )}
    </>
  )
}
