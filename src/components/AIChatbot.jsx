import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartPulse, 
  RefreshCw, 
  Send, 
  Loader2, 
  HelpCircle, 
  Keyboard, 
  Mic, 
  MicOff 
} from 'lucide-react';

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const UrduVirtualKeyboard = ({ onKeyPress, onClose }) => {
  const urduKeyboard = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ہ', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
    ['ظ', 'ط', 'ز', 'ر', 'ذ', 'ڑ', 'و', 'ے', 'ء', 'چ', 'پ', 'ٹ', 'ڈ']
  ];

  return (
    <div 
      className="
        absolute 
        bottom-20 
        right-0 
        w-full
        max-w-sm
        p-3 
        rounded-2xl 
        z-50 
        bg-gradient-to-br 
        from-blue-600 
        to-indigo-700 
        shadow-2xl
        border-2
        border-blue-500
        mx-2
      "
    >
      <div className="absolute top-2 right-2">
        <button 
          onClick={onClose}
          className="text-xl font-bold text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      </div>
      {urduKeyboard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center flex-wrap gap-1 mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="
                px-2 py-1.5
                text-sm font-medium
                rounded-lg
                transition-all duration-150
                transform hover:scale-105
                active:scale-95
                bg-blue-700 
                text-white 
                hover:bg-blue-600 
                active:bg-blue-800 
                shadow-md
              "
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={() => onKeyPress(' ')}
          className="
            px-4 py-1.5
            text-sm font-medium
            rounded-lg
            flex-grow
            max-w-xs
            transition-all duration-150
            bg-blue-700 
            text-white 
            hover:bg-blue-600 
            shadow-md
          "
        >
          Space
        </button>
        <button
          onClick={() => onKeyPress('⌫')}
          className="
            px-4 py-1.5
            text-sm font-medium
            rounded-lg
            transition-all duration-150
            bg-red-500 
            text-white 
            hover:bg-red-600 
            shadow-md
          "
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

const AIChatbot = () => {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const AZURE_SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY;
  const AZURE_REGION = "eastus";

  console.log('API Key:', API_KEY);
  console.log('Azure Speech Key:', AZURE_SPEECH_KEY);

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Welcome to Emergency Support. We're here to help you through difficult moments with care and compassion. Your safety and well-being are our priority.", 
      isBot: true,
      language: 'english' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUrduKeyboard, setShowUrduKeyboard] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognizerRef = useRef(null);
  const [messageHistory, setMessageHistory] = useState([]);


const SYSTEM_PROMPTS = {
    english: "You are a critical emergency first aid support AI, designed to provide immediate, life-saving guidance. Your primary objectives are to communicate with clear, concise, and confident language while maintaining a calm and authoritative tone to reduce user panic. You should use professional medical terminology when appropriate. In any emergency, prioritize immediate safety by quickly assessing the situation and providing step-by-step instructions to stabilize the patient. Guide users through critical first-response actions and clearly differentiate between actions that must be taken immediately and those that can wait. Your response must cover a wide range of emergencies, including trauma, medical conditions, and environmental risks, offering specific and actionable instructions tailored to the scenario. Details about patient positioning, pressure application, and breathing techniques should be included. When professional medical help is essential, provide clear instructions on the exact information to communicate to emergency services. Alongside practical guidance, your tone should be compassionate and reassuring, helping users remain focused and calm. Offer encouraging statements to reduce anxiety and ensure clear, structured guidance. However, explicitly state that AI guidance is not a substitute for professional medical care, strongly encouraging users to seek professional help in severe situations. Provide clear criteria for when immediate medical intervention is necessary. If a life-threatening emergency is detected, your critical protocol is to first instruct users to book emergency services through the app before offering any additional guidance.You should to the point and give concisise and clear answers.",
    
    urdu: "آپ ایک اہم ہنگامی ابتدائی طبی امداد کی مصنوعی ذہانت ہیں، جو فوری، جان بچانے والی رہنمائی فراہم کرنے کے لیے ڈیزائن کی گئی ہے۔ آپ کے بنیادی مقاصد درج ذیل ہیں: 1. پرسکون اور اختیار والی رہنمائی: آپ کو واضح، مختصر اور پراعتماد زبان میں بات چیت کرنی ہے تاکہ صارف کی افراتفری کو کم کیا جا سکے۔ اس کے ساتھ ایک پرسکون رویہ اختیار کریں جو اعتماد کو بڑھائے اور موزوں طبی اصطلاحات کا استعمال کریں تاکہ رہنمائی پیشہ ورانہ نظر آئے۔ 2. فوری حفاظت کو ترجیح: ہنگامی صورتحال کا فوری جائزہ لینا ضروری ہے تاکہ مریض کو مستحکم کرنے کے لیے مرحلہ وار ہدایات فراہم کی جا سکیں۔ آپ کو اہم ابتدائی کارروائیوں کی رہنمائی دینی ہے اور واضح طور پر فرق کرنا ہے کہ کون سی کارروائیاں فوری انجام دینی ہیں اور کون سی انتظار کر سکتی ہیں۔ 3. جامع ہنگامی ردعمل: آپ کو مختلف ہنگامی صورتحال جیسے چوٹ، طبی مسائل، اور ماحولیاتی خطرات کا احاطہ کرنا ہے۔ منظرنامے کے مطابق مخصوص اور عملی ہدایات فراہم کریں جن میں مریض کی پوزیشن، دباؤ ڈالنے کے طریقے، اور سانس کی تکنیکوں کی تفصیلات شامل ہوں۔ پیشہ ور طبی امداد کی ضرورت ہونے پر، ایمرجنسی سروسز کو فراہم کی جانے والی معلومات پر رہنمائی دیں۔ 4. جذباتی سہارا اور اطمینان: آپ کا لہجہ ہمدردی اور اطمینان کا مظہر ہونا چاہیے تاکہ صارف پرسکون رہے اور افراتفری سے بچ سکے۔ حوصلہ افزا بیانات دیں اور واضح رہنمائی کے ذریعے صارف کی توجہ مرکوز رکھیں۔ 5. محدودیتیں اور پیش رفت: واضح کریں کہ آپ کی رہنمائی پیشہ ور طبی دیکھ بھال کا متبادل نہیں ہے اور سنگین حالات میں فوری طور پر پیشہ ور طبی امداد حاصل کرنے کی ضرورت پر زور دیں۔ واضح معیار فراہم کریں کہ کب فوری طبی مداخلت ضروری ہے۔ اہم پروٹوکول: اگر جان لیوا ایمرجنسی کا پتہ چلتا ہے، تو فوری طور پر صارف کو ہدایت دیں کہ وہ ہماری ایپ کا استعمال کرتے ہوئے سب سے پہلے ایمرجنسی سروسز بک کریں اور اس کے آپ کو نقطہ نظر اور جامع اور واضح جواب دینا چاہئے.بعد اضافی رہنمائی فراہم کریں۔"
};


  const detectLanguage = (text) => {
    const urduRegex = /[\u0600-\u06FF]/;
    return urduRegex.test(text) ? 'urdu' : 'english';
  };

  async function translation(text) {
    try {
      const prompt = "You are a professional translator and language detection expert. " +
      "1. Identify the exact language of the input text, including dialect or script variant. " +
      "2. If the text is in Roman script of any language (Urdu, Hindi, Punjabi etc.).Give piority to urdu over hindi in roman language, " +
      "translate it to the most appropriate standard script of that language. " +
      "3. IMPORTANT: Return ONLY the translated text. No additional explanation or commentary.No neend to translate if text is already in english return the text as it is.";

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: text }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content?.trim();
        
      if (!translatedText) {
          throw new Error('No translation received from the API');
      }
      console.log('Translated text:', translatedText);
      return translatedText;

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return "I cannot translate text.Pllease try again later";
    }
  }

  const initializeSpeechRecognition = () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_REGION);
    
    const languageConfig = {
      'english': 'en-US',
      'urdu': 'ur-PK'
    }[currentLanguage];
    
    speechConfig.speechRecognitionLanguage = languageConfig;

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizerRef.current = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizerRef.current.recognizing = (s, e) => {
      console.log('Recognizing:', e.result.text);
    };

    recognizerRef.current.recognized = async (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const recognizedText = e.result.text.trim();
        if (recognizedText) {
          const translatedText = await translation(recognizedText);
          setMessage(translatedText);
          handleSendMessage(translatedText);
        }
      }
      stopListening();
    };

    recognizerRef.current.canceled = (s, e) => {
      console.log('Speech recognition canceled:', e);
      stopListening();
    };
  };

  const startListening = () => {
    try {
      if (!recognizerRef.current) {
        initializeSpeechRecognition();
      }

      setIsListening(true);
      recognizerRef.current.startContinuousRecognitionAsync();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync(
          () => {
            setIsListening(false);
          },
          (error) => {
            console.error('Error stopping recognition:', error);
            setIsListening(false);
          }
        );
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  };

  const generateOpenAIResponse = async (userMessage, language = 'english') => {
    try {
      const contextMessages = messageHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Context messages:', contextMessages);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS[language] },
            ...contextMessages,
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return "I apologize for the technical difficulty. Please seek immediate help through local emergency services. Your safety is paramount.";
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState('english');

  const handleSendMessage = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || message;
    
    if (messageToSend.trim()) {
      const detectedLanguage = detectLanguage(messageToSend);
      setCurrentLanguage(detectedLanguage);

      const userMessage = { 
        id: messages.length + 1, 
        text: messageToSend, 
        isBot: false,
        language: detectedLanguage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setMessageHistory(prev => [...prev, {
        role: 'user',
        content: messageToSend,
        language: detectedLanguage
      }]);

      setMessage("");
      setIsLoading(true);

      try {
        const response = await generateOpenAIResponse(messageToSend, detectedLanguage);
        const botMessage = {
          id: messages.length + 2,
          text: response,
          isBot: true,
          language: detectedLanguage,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        
        setMessageHistory(prev => [...prev, {
          role: 'assistant',
          content: response,
          language: detectedLanguage
        }]);

      } catch (error) {
        console.error('Error:', error);
        const errorMessage = {
          id: messages.length + 2,
          text: detectedLanguage === 'urdu' 
            ? "معذرت، تکنیکی مسئلہ۔ برائے مہربانی مقامی ہنگامی خدمات سے فوری مدد لیں۔ آپ کی حفاظت سب سے اہم ہے۔" 
            : "I apologize for the technical difficulty. Please seek immediate help through local emergency services. Your safety is paramount.",
          isBot: true,
          language: detectedLanguage,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, errorMessage]);
        
        setMessageHistory(prev => [...prev, {
          role: 'assistant',
          content: errorMessage.text,
          language: detectedLanguage
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUrduKeyPress = (key) => {
    if (key === '⌫') {
      setMessage(prev => prev.slice(0, -1));
    } else {
      setMessage(prev => prev + key);
    }
  };

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mb-4 relative overflow-hidden border-2 border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <HeartPulse className="w-6 h-6 text-white" />
                <h3 className="font-bold text-lg">Emergency Support</h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 sm:h-96 overflow-y-auto p-4 space-y-4 bg-blue-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`
                    max-w-[80%] 
                    rounded-2xl 
                    px-4 
                    py-3 
                    ${msg.isBot 
                      ? 'bg-white text-gray-800 shadow-md' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'}
                    ${msg.language === 'urdu' ? 'text-right' : ''}
                  `}
                  style={{
                    direction: msg.language === 'urdu' ? 'rtl' : 'ltr',
                    fontFamily: msg.language === 'urdu' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-800 shadow-md">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-blue-100 relative">
            {showUrduKeyboard && (
              <UrduVirtualKeyboard 
                onKeyPress={handleUrduKeyPress} 
                onClose={() => setShowUrduKeyboard(false)}
              />
            )}
            <div className="flex space-x-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setShowUrduKeyboard(!showUrduKeyboard)}
                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <Keyboard className="h-5 w-5" />
              </button>
              
              <input
                type="text"
                placeholder="Type emergency message..."
                className="
                  flex-1 
                  rounded-lg 
                  px-4 
                  py-2 
                  bg-blue-50 
                  text-gray-800 
                  placeholder-blue-400 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500
                "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || isListening}
              />
              
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || isListening}
                className={`p-2 rounded-lg transition-colors 
                  ${isLoading || isListening
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'}
                `}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          bg-gradient-to-r 
          from-blue-600 
          to-indigo-700 
          text-white 
          rounded-full 
          p-4 
          shadow-2xl 
          hover:from-blue-700 
          hover:to-indigo-800 
          transition-all 
          flex 
          items-center 
          justify-center
        "
      >
        <HelpCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AIChatbot;
















































