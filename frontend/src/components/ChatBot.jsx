import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Leaf, Loader2, RotateCcw } from "lucide-react";

// ─── Smart Local Knowledge Base ───────────────────────────────────────────────
const KB = [
  // Greetings
  { keys: ["hello","hi","hey","vanakkam","hai"], answer: "🌿 Hello! I'm your Plant Disease Assistant. Ask me about plant diseases, medicines, treatment steps, or farming tips!" },
  { keys: ["who are you","what are you","about you","about bot"], answer: "🤖 I'm an AI Plant Disease Assistant built into the **AI Based Leaf Disease Detection System**. I can answer questions about plant diseases, medicines, treatment & prevention!" },
  { keys: ["thank","thanks","nandri","super","good","great","awesome"], answer: "😊 You're welcome! Feel free to ask anything about plant diseases or farming anytime!" },

  // ── DISEASES ────────────────────────────────────────────────────────────────
  // Early Blight
  { keys: ["early blight","alternaria"], answer: "🍅 **Early Blight (Alternaria solani)**\n\nIt's a fungal disease affecting Tomato & Potato.\n\n📍 **Symptoms:** Dark brown concentric rings (target-board pattern) on lower leaves, yellow halos, premature leaf drop.\n\n💊 **Medicines:** Mancozeb 75% WP, Chlorothalonil (Daconil), Copper Oxychloride.\n\n🛡️ **Treatment:** Remove infected leaves, spray fungicide every 7-10 days, avoid overhead watering.\n\n✅ **Prevention:** Crop rotation, disease-resistant varieties, remove crop debris." },

  // Late Blight
  { keys: ["late blight","phytophthora"], answer: "⚠️ **Late Blight (Phytophthora infestans)**\n\nHighly destructive disease affecting Tomato & Potato.\n\n📍 **Symptoms:** Water-soaked grayish-green spots, white cottony growth on leaf undersides, rapid plant collapse.\n\n💊 **Medicines:** Metalaxyl + Mancozeb, Cymoxanil 8% + Mancozeb 64%, Copper Hydroxide.\n\n🛡️ **Treatment:** URGENT — spray immediately! Remove infected plants. Apply fungicide every 5-7 days.\n\n✅ **Prevention:** Avoid overhead irrigation, use certified seeds, maintain field drainage." },

  // Powdery Mildew
  { keys: ["powdery mildew","white powder","white coating"], answer: "🌫️ **Powdery Mildew**\n\nFungal disease affecting Squash, Grape, Cherry & more.\n\n📍 **Symptoms:** White powdery coating on leaf surface, curling/distortion of young leaves, stunted growth.\n\n💊 **Medicines:** Sulphur 80% WP (2g/L), Myclobutanil 10% WP, Neem Oil 10,000 ppm (organic).\n\n🛡️ **Treatment:** Remove infected leaves, spray sulphur fungicide in early morning, ensure air circulation.\n\n✅ **Prevention:** Wide plant spacing, avoid excess nitrogen fertilizer, plant resistant varieties." },

  // Leaf Scorch
  { keys: ["leaf scorch","scorch"], answer: "🍓 **Leaf Scorch (Strawberry)**\n\nFungal disease caused by Diplocarpon earlianum.\n\n📍 **Symptoms:** Small dark purple spots, centers turn gray/white, leaves look scorched/burned.\n\n💊 **Medicines:** Captan 50% WP, Myclobutanil, Copper-based fungicides.\n\n🛡️ **Treatment:** Remove infected leaves, spray fungicide, improve drainage.\n\n✅ **Prevention:** Avoid wet foliage, use certified disease-free planting material." },

  // Black Rot
  { keys: ["black rot"], answer: "🍇 **Black Rot (Grape / Apple)**\n\n📍 **Symptoms:** Circular tan/brown spots with dark borders on leaves, mummified shriveled fruits, black spore-producing bodies visible.\n\n💊 **Medicines:** Mancozeb 75% WP, Captan 50% WP, Myclobutanil 10% WP.\n\n🛡️ **Treatment:** Prune infected canes, remove mummified fruits, apply fungicide at bud break.\n\n✅ **Prevention:** Good pruning hygiene, sanitation, remove dead wood." },

  // Bacterial Spot
  { keys: ["bacterial spot","bacterial"], answer: "🦠 **Bacterial Spot**\n\nBacterial disease affecting Tomato, Pepper & Peach.\n\n📍 **Symptoms:** Small water-soaked spots turning dark brown/black, yellow halos around spots, fruit scabs.\n\n💊 **Medicines:** Copper Oxychloride 50% WP, Streptomycin Sulphate 90% SP, Copper Hydroxide.\n\n🛡️ **Treatment:** Spray copper bactericide immediately, remove heavily infected plant parts.\n\n✅ **Prevention:** Use disease-free certified seeds, avoid working in wet fields, crop rotation." },

  // Mosaic Virus
  { keys: ["mosaic","virus","yellow curl"], answer: "🦠 **Mosaic Virus / Yellow Leaf Curl Virus**\n\nViral disease spread by whiteflies.\n\n📍 **Symptoms:** Mottled yellow-green mosaic pattern on leaves, leaf curling, stunted plant growth, reduced yield.\n\n💊 **Medicines:** No direct cure for virus! Control the vector:\n- Imidacloprid 17.8% SL — kills whiteflies\n- Thiamethoxam 25% WG — systemic insecticide\n\n🛡️ **Treatment:** Remove and destroy infected plants immediately to prevent spread.\n\n✅ **Prevention:** Use virus-resistant varieties, silver reflective mulch, yellow sticky traps." },

  // Citrus Greening
  { keys: ["citrus","greening","hlb","huanglongbing"], answer: "🍊 **Citrus Greening (HLB - Huanglongbing)**\n\nMost devastating citrus disease, spread by Asian citrus psyllid.\n\n📍 **Symptoms:** Yellow mottling of leaves (asymmetric), small misshapen bitter fruit, premature fruit drop, twig dieback.\n\n💊 **Management:** No cure. Control psyllid vector:\n- Imidacloprid, Thiamethoxam sprays\n- Remove and destroy infected trees\n\n✅ **Prevention:** Use certified disease-free nursery plants, control psyllid population, quarantine infected areas." },

  // ── MEDICINES ───────────────────────────────────────────────────────────────
  { keys: ["mancozeb"], answer: "💊 **Mancozeb 75% WP**\n\n🔬 Type: Broad-spectrum contact fungicide (Dithiocarbamate group)\n\n📏 **Dosage:** 2-2.5g per litre of water\n\n🎯 **Works against:** Early Blight, Late Blight, Downy Mildew, Leaf Spot, Black Rot\n\n⏰ **Spray interval:** Every 7-10 days during disease season\n\n⚠️ **Note:** Do not spray in rain. Apply in morning or evening." },

  { keys: ["copper","copper oxychloride","copper hydroxide"], answer: "💊 **Copper-based Fungicides (Copper Oxychloride / Copper Hydroxide)**\n\n🔬 Type: Protective + Bactericidal (Multi-site action)\n\n📏 **Dosage:** 2.5g per litre of water\n\n🎯 **Works against:** Bacterial Spot, Downy Mildew, Early Blight, Leaf Curl\n\n✅ **Organic approved** — safe for organic farming\n\n⚠️ **Note:** Avoid use in hot weather (>35°C) to prevent phytotoxicity." },

  { keys: ["neem oil","neem"], answer: "🌿 **Neem Oil (Organic Pesticide & Fungicide)**\n\n📏 **Dosage:** 5ml neem oil + 1ml liquid soap per litre of water\n\n🎯 **Works against:** Powdery Mildew, Aphids, Whiteflies, Spider Mites, Fungal diseases\n\n✅ 100% Organic — safe for humans, bees & environment\n\n⏰ **Apply:** Early morning or evening. Repeat every 7-14 days\n\n⚠️ **Note:** Test on small area first. Not suitable in extreme heat." },

  { keys: ["bordeaux mixture","bordeaux"], answer: "💊 **Bordeaux Mixture (Traditional Organic Fungicide)**\n\n🔬 Made from: Copper Sulphate + Lime + Water\n\n📏 **Mix:** 100g CuSO₄ + 100g Lime + 10 litres water\n\n🎯 **Works against:** Downy Mildew, Early Blight, Bacterial diseases, Grape diseases\n\n✅ Classic organic copper fungicide — over 100 years in use!\n\n⚠️ **Note:** Do not mix with other pesticides." },

  { keys: ["metalaxyl"], answer: "💊 **Metalaxyl + Mancozeb (Ridomil Gold)**\n\n🔬 Type: Systemic + Contact fungicide\n\n📏 **Dosage:** 2.5g per litre of water\n\n🎯 **Specifically for:** Late Blight (Phytophthora), Downy Mildew\n\n⏰ **Spray interval:** Every 10-14 days\n\n⚠️ **Note:** Use cautiously — resistance can develop. Rotate with other fungicides." },

  // ── PREVENTION ──────────────────────────────────────────────────────────────
  { keys: ["prevent","prevention","avoid disease","protect plant"], answer: "🛡️ **General Plant Disease Prevention Tips:**\n\n1. 🔄 **Crop Rotation** — Change crops every 2-3 years\n2. 🌱 **Disease-resistant varieties** — Choose resistant seeds/seedlings\n3. 💧 **Proper irrigation** — Water at soil level (avoid wetting leaves)\n4. ✂️ **Pruning** — Remove dead/infected leaves regularly\n5. 🧹 **Sanitation** — Remove crop debris after harvest\n6. 📏 **Plant spacing** — Good air circulation prevents fungal spread\n7. 🌱 **Balanced fertilizer** — Avoid excess nitrogen\n8. 🔍 **Weekly monitoring** — Detect disease early!" },

  { keys: ["crop rotation"], answer: "🔄 **Crop Rotation:**\n\nGrowing different crops in the same field each season.\n\n✅ **Benefits:**\n- Breaks pest/disease cycles\n- Improves soil fertility\n- Reduces need for pesticides\n\n📋 **Example:** Tomato → Corn → Legume → Tomato (every 3 years)\n\n⚠️ **Tip:** Avoid planting same family crops back-to-back (e.g., tomato & potato are both Solanaceae)" },

  // ── GENERAL FARMING ─────────────────────────────────────────────────────────
  { keys: ["healthy leaf","healthy plant","how to identify healthy"], answer: "🌿 **Signs of a Healthy Leaf:**\n\n✅ Uniform green color throughout\n✅ No spots, patches or discoloration\n✅ Firm & flat texture (not curled)\n✅ No holes or tears\n✅ No unusual coatings (white/black powder)\n✅ Normal size for the plant variety\n\n❌ **Warning signs:** Yellow edges, dark spots, wilting, white powder, water-soaked patches" },

  { keys: ["npk","fertilizer","nitrogen","phosphorus","potassium"], answer: "🌱 **NPK Fertilizer Explained:**\n\n🟢 **N (Nitrogen)** — Promotes leaf & stem growth. Deficiency = yellowing leaves\n\n🟠 **P (Phosphorus)** — Root development & flowering. Deficiency = purple/reddish leaves\n\n🔵 **K (Potassium)** — Fruit quality & disease resistance. Deficiency = brown leaf edges\n\n📏 **General ratio for vegetables:** NPK 19:19:19 (balanced) or 15:15:15\n\n⚠️ **Excess Nitrogen** makes plants susceptible to fungal diseases!" },

  { keys: ["spray time","when to spray","best time spray"], answer: "⏰ **Best Time to Spray Pesticides/Fungicides:**\n\n✅ **Early Morning (6-9 AM)** — Best! Leaves are dry, no wind\n✅ **Late Evening (5-7 PM)** — Good alternative\n\n❌ **Avoid:**\n- Midday (chemical burns in heat)\n- Before rain (gets washed off)\n- Windy conditions (drift wastage)\n- Extreme heat (>35°C)\n\n💡 **Tip:** Add a few drops of liquid soap as sticker/spreader for better coverage!" },

  { keys: ["organic","organic farming","natural remedy"], answer: "🌿 **Organic Disease Management Options:**\n\n1. **Neem Oil** — Fungicide + Insecticide (5ml/L)\n2. **Bordeaux Mixture** — Copper fungicide (traditional)\n3. **Trichoderma viride** — Bio-fungicide for soil\n4. **NSKE (Neem Seed Kernel Extract)** — 5% spray\n5. **Wood ash** — Alkaline treatment for fungal diseases\n6. **Turmeric spray** — Mild antibacterial (5g/L)\n7. **Garlic extract** — Natural antifungal\n\n✅ All eco-friendly & safe for humans, insects & soil!" },

  // ── PLANTS SUPPORTED ────────────────────────────────────────────────────────
  { keys: ["which plant","supported plant","what plant","tomato","potato","apple","corn","grape"], answer: "🌿 **Plants Supported in Our Detection System:**\n\n🍅 Tomato — 9 diseases\n🥔 Potato — 3 diseases\n🍎 Apple — 4 diseases\n🌽 Corn (Maize) — 4 diseases\n🍇 Grape — 4 diseases\n🌶️ Pepper — 2 diseases\n🍑 Peach — 2 diseases\n🍓 Strawberry — 2 diseases\n🎃 Squash — 1 disease\n🍊 Orange — 1 disease\n\n📊 Total: **50+ disease conditions** across 10 plant species!" },

  { keys: ["accuracy","how accurate"], answer: "📊 **Detection Accuracy:**\n\nOur MobileNetV2 CNN model achieves:\n\n🎯 **Training Accuracy:** 98.5%\n🎯 **Validation Accuracy:** 96.8%\n⚡ **Inference Time:** < 1.2 seconds\n\n🔬 Trained on **PlantVillage Dataset** with 54,309 leaf images across 38 disease categories.\n\n✅ Results are most accurate with clear, well-lit, close-up leaf photos." },

  { keys: ["cnn vs mobilenet","custom cnn","mobilenet vs cnn","why mobilenet","compare"], answer: "🔬 **Custom CNN vs. MobileNetV2 Comparison:**\n\n1️⃣ **Validation Accuracy:**\n• Custom CNN: **86.4%**\n• MobileNetV2: **96.8% (+10.4% higher!)**\n\n2️⃣ **Model Size & Parameters:**\n• Custom CNN: 12.8M parameters (~72 MB)\n• MobileNetV2: **3.4M parameters (~14 MB — 5x lighter!)**\n\n3️⃣ **Inference Speed:**\n• Custom CNN: ~3.2 seconds\n• MobileNetV2: **< 1.2 seconds (Real-time)**\n\n💡 **Why MobileNetV2 is better:** Uses pre-trained ImageNet weights (Transfer Learning) + Depthwise Separable Convolutions to prevent overfitting!" },

  { keys: ["how to use","upload","how does it work"], answer: "📱 **How to Use the System:**\n\n1️⃣ Click **'Detect'** in the navigation menu\n2️⃣ **Upload** a clear photo of the affected leaf\n3️⃣ Wait **< 2 seconds** for AI analysis\n4️⃣ View **Disease Name, Confidence Score & Symptoms**\n5️⃣ Get **Medicines, Treatment Steps & Prevention** tips\n6️⃣ Click **'Download PDF Report'** to save the diagnosis\n\n💡 **Tip:** Use a clear, well-lit, close-up photo for best accuracy!" },

  // Default
  { keys: ["__default__"], answer: "🌿 I'm your Plant Disease Assistant! I can help you with:\n\n🦠 **Disease Info** — Early Blight, Late Blight, Powdery Mildew, etc.\n💊 **Medicines** — Mancozeb, Copper fungicides, Neem Oil, etc.\n🛡️ **Treatment** — How to spray, dosage, frequency\n🌱 **Prevention** — Crop rotation, resistant varieties, organic methods\n🌾 **Farming Tips** — NPK fertilizer, spray timing, soil health\n\nJust type your question and I'll help! 😊" },
];

function getAnswer(msg) {
  const lower = msg.toLowerCase();
  for (const item of KB) {
    if (item.keys[0] === "__default__") continue;
    if (item.keys.some(k => lower.includes(k))) return item.answer;
  }
  return KB.find(i => i.keys[0] === "__default__").answer;
}

// ──────────────────────────────────────────────────────────────────────────────

const QUICK_QS = [
  "What is Early Blight?",
  "How to treat Powdery Mildew?",
  "Best medicine for Late Blight?",
  "How to prevent leaf diseases?",
];

const BOT_INTRO = {
  role: "bot",
  text: "🌿 Hello! I'm your **Plant Disease Assistant**. Ask me about plant diseases, medicines, treatment steps, or farming tips!",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

function fmtText(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

export default function ChatBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([BOT_INTRO]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); } }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: userText, time: now }]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // simulate thinking

    const reply = getAnswer(userText);
    setMessages(prev => [...prev, {
      role: "bot", text: reply,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    if (!open) setUnread(u => u + 1);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button with Pill & Glow */}
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
        {!open && (
          <div 
            onClick={() => setOpen(true)}
            className="cursor-pointer bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-2xl border border-emerald-400/60 backdrop-blur-md flex items-center gap-1.5 animate-bounce hover:scale-105 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Ask AI Assistant 🌿</span>
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle AI ChatBot"
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 hover:from-emerald-500 hover:to-teal-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-white/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {open ? <X size={24} className="stroke-[2.5]" /> : <MessageCircle size={26} className="stroke-[2.5]" />}
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-emerald-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200" style={{ maxHeight: "540px" }}>

          {/* Header */}
          <div className="bg-green-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf size={16} className="text-white"/>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Plant Disease Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"/>
                  <p className="text-green-200 text-xs">Online — Smart AI Mode</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMessages([BOT_INTRO])} className="text-white/70 hover:text-white" title="Reset">
                <RotateCcw size={15}/>
              </button>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X size={18}/>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50" style={{ minHeight: "280px", maxHeight: "340px" }}>

            {messages.length === 1 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400 text-center mb-2">💬 Quick Questions:</p>
                {QUICK_QS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="block w-full text-left text-xs bg-white border border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700 rounded-xl px-3 py-2 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mr-1 mt-1">
                    <Leaf size={12} className="text-green-600"/>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.role === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                }`}>
                  <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: fmtText(msg.text) }}/>
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-green-200" : "text-gray-400"}`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mr-1 mt-1">
                  <Leaf size={12} className="text-green-600"/>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}/>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}/>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about plant diseases..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-300 transition-all"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all"
            >
              {loading ? <Loader2 size={15} className="animate-spin"/> : <Send size={15}/>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
