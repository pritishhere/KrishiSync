import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';

const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://192.168.1.3:5000/api';

export default function App() {
  const [backendHealth, setBackendHealth] = useState('Checking...');

  // Language State
  const [lang, setLang] = useState('en');
  const t = {
    en: {
      eyebrow: "Hackathon-ready MERN + Native app",
      title: "KrishiSync",
      subtitle: "A modern full-stack platform built for fast demos, clean UI, and a reliable backend.",
      otpHeader: "📱 Farmer Mobile OTP Authentication (Twilio SMS + JWT)",
      sendOtp: "📲 Send OTP SMS",
      verifyOtp: "✅ Verify OTP",
      cropScanner: "🔬 Plant.id AI Crop Leaf Scanner",
      irrigation: "🌧️ Smart Irrigation Advisory Engine",
      whatsappBot: "💬 Twilio WhatsApp & SMS Bot Simulator"
    },
    hi: {
      eyebrow: "हैकथॉन-रेडी MERN + नैटिव ऐप",
      title: "कृषिसिंक्स (KrishiSync)",
      subtitle: "आधुनिक फुल-स्टैक प्लेटफॉर्म - त्वरित प्रदर्शन, स्वच्छ UI और विश्वसनीय बैकएंड।",
      otpHeader: "📱 किसान मोबाइल OTP प्रमाणीकरण (Twilio SMS + JWT)",
      sendOtp: "📲 OTP SMS भेजें",
      verifyOtp: "✅ OTP सत्यापित करें",
      cropScanner: "🔬 Plant.id AI फसल पत्ती स्कैनर",
      irrigation: "🌧️ स्मार्ट सिंचाई सलाहकार इंजन",
      whatsappBot: "💬 ट्विलियो व्हाट्सएप और एसएमएस बॉट"
    },
    bn: {
      eyebrow: "হ্যাকথন-রেডি MERN + নেটিভ অ্যাপ",
      title: "কৃষিসিংক (KrishiSync)",
      subtitle: "দ্রুত ডেমো, আধুনিক UI এবং নির্ভরযোগ্য ব্যাকএন্ড সহ একটি ফুল-স্ট্যাক প্ল্যাটফর্ম।",
      otpHeader: "📱 কৃষক মোবাইল OTP প্রমাণীকরণ (Twilio SMS + JWT)",
      sendOtp: "📲 ওটিপি পাঠান",
      verifyOtp: "✅ ওটিপি যাচাই করুন",
      cropScanner: "🔬 Plant.id এআই শস্যের পাতা স্ক্যানার",
      irrigation: "🌧️ স্মার্ট সেচ পরামর্শ ইঞ্জিন",
      whatsappBot: "💬 টুইলিও হোয়াটসঅ্যাপ ও এসএমএস বট"
    }
  }[lang];

  // Auth State
  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [authStep, setAuthStep] = useState('SEND');
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');

  // Irrigation State
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSoil, setSelectedSoil] = useState('loam');
  const [irrigationLoading, setIrrigationLoading] = useState(false);
  const [irrigationData, setIrrigationData] = useState(null);

  // Disease State
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState(null);

  // Bot State
  const [botCommand, setBotCommand] = useState('WATER');
  const [botMessage, setBotMessage] = useState('');
  const [botTime, setBotTime] = useState('');

  // Voice Search State
  const [speechText, setSpeechText] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => setBackendHealth(data.message || 'Server Active'))
      .catch(() => setBackendHealth('Backend offline'));

    fetchIrrigationAdvice('wheat', 'loam');
  }, []);

  const fetchIrrigationAdvice = (crop, soil) => {
    setIrrigationLoading(true);
    fetch(`${API_BASE_URL}/irrigation/schedule?crop=${crop}&soil=${soil}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setIrrigationData(data.data);
        setIrrigationLoading(false);
      })
      .catch(() => setIrrigationLoading(false));
  };

  const handleSendOtp = () => {
    setAuthLoading(true);
    setAuthMessage('');
    fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone })
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthLoading(false);
        if (data.success) {
          setAuthStep('VERIFY');
          setAuthMessage(`OTP sent via Twilio SMS to ${phone}. (Dev OTP: ${data.devOtp || '123456'})`);
        } else {
          setAuthMessage(data.error || 'Failed to send OTP');
        }
      })
      .catch(() => {
        setAuthLoading(false);
        setAuthMessage('Network error sending OTP');
      });
  };

  const handleVerifyOtp = () => {
    setAuthLoading(true);
    setAuthMessage('');
    fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, otp })
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthLoading(false);
        if (data.success) {
          setAuthStep('LOGGED_IN');
          setAuthUser(data.user);
          setAuthMessage('Verified successfully! JWT Session Token generated.');
        } else {
          setAuthMessage(data.error || 'Invalid OTP');
        }
      })
      .catch(() => {
        setAuthLoading(false);
        setAuthMessage('Network error verifying OTP');
      });
  };

  const scanLeaf = () => {
    setDiseaseLoading(true);
    const dummyBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
    fetch(`${API_BASE_URL}/disease/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dummyBase64 })
    })
      .then((res) => res.json())
      .then((data) => {
        setDiseaseLoading(false);
        if (data.success) setDiseaseResult(data.data);
      })
      .catch(() => setDiseaseLoading(false));
  };

  const sendBotCmd = (cmd) => {
    fetch(`${API_BASE_URL}/twilio/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Body: cmd, From: '+919876543210' }).toString()
    })
      .then((res) => res.text())
      .then((xmlData) => {
        const match = xmlData.match(/<Message>([\s\S]*?)<\/Message>/);
        let text = match ? match[1] : xmlData;
        text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        setBotMessage(text);
        setBotTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(() => setBotMessage('Failed to connect to Twilio webhook endpoint'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView style={styles.appShell} contentContainerStyle={styles.scrollContent}>

        {/* Hero Banner Section (Exact Web Design) */}
        <View style={styles.heroCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.eyebrow}>{t.eyebrow}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity onPress={() => setLang('en')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: lang === 'en' ? '#2563eb' : '#e2e8f0' }}>
                <Text style={{ color: lang === 'en' ? '#fff' : '#334155', fontWeight: 'bold', fontSize: 12 }}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLang('hi')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: lang === 'hi' ? '#16a34a' : '#e2e8f0' }}>
                <Text style={{ color: lang === 'hi' ? '#fff' : '#334155', fontWeight: 'bold', fontSize: 12 }}>हिंदी</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLang('bn')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: lang === 'bn' ? '#ca8a04' : '#e2e8f0' }}>
                <Text style={{ color: lang === 'bn' ? '#fff' : '#334155', fontWeight: 'bold', fontSize: 12 }}>বাংলা</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.heroTitle}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Backend: {backendHealth}</Text>
          </View>
        </View>

        {/* MEMBER 4: X-FACTOR SUBSYSTEM */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>🚀 X-Factor & Intelligence Subsystem</Text>

          {/* 1. Phone OTP Auth Card */}
          <View style={styles.blueCard}>
            <Text style={styles.blueCardTitle}>📱 Farmer Mobile OTP Authentication (Twilio SMS + JWT)</Text>

            {authStep === 'SEND' && (
              <View style={styles.rowForm}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter Mobile Number (+91...)"
                />
                <TouchableOpacity style={styles.blueBtn} onPress={handleSendOtp} disabled={authLoading}>
                  <Text style={styles.btnText}>{authLoading ? 'Sending...' : '📲 Send OTP SMS'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'VERIFY' && (
              <View style={styles.rowForm}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  placeholder="Enter 6-digit OTP (123456)"
                />
                <TouchableOpacity style={styles.greenBtn} onPress={handleVerifyOtp} disabled={authLoading}>
                  <Text style={styles.btnText}>{authLoading ? 'Verifying...' : '✅ Verify OTP'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'LOGGED_IN' && authUser && (
              <View style={styles.verifiedRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifiedUser}>🎉 Authenticated Farmer: {authUser.name} ({authUser.phoneNumber})</Text>
                  <Text style={styles.verifiedBadge}>🔒 Session Status: Active & Verified (30-Day Encrypted Auth)</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={() => { setAuthStep('SEND'); setAuthUser(null); }}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMessage ? <Text style={styles.infoMessage}>{authMessage}</Text> : null}
          </View>

          {/* 2. Smart Irrigation Advisory Engine Card */}
          <View style={styles.greenCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.greenCardTitle}>🌧️ Smart Irrigation Advisory Engine</Text>
              <TouchableOpacity style={styles.refreshBtn} onPress={() => fetchIrrigationAdvice(selectedCrop, selectedSoil)}>
                <Text style={styles.refreshBtnText}>🔄 Refresh Weather</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Crop Type:</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'wheat', label: '🌾 Wheat (Gehun)' },
                { id: 'mustard', label: '🌱 Mustard (Sarson)' },
                { id: 'rice', label: '🌾 Rice (Paddy)' },
                { id: 'cotton', label: '☁️ Cotton' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.pill, selectedCrop === item.id && styles.pillActive]}
                  onPress={() => {
                    setSelectedCrop(item.id);
                    fetchIrrigationAdvice(item.id, selectedSoil);
                  }}
                >
                  <Text style={[styles.pillText, selectedCrop === item.id && styles.pillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Soil Type:</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'loam', label: '🌱 Loam Soil (Optimal)' },
                { id: 'clay', label: '🧱 Clay Soil (High Retention)' },
                { id: 'sandy', label: '🏖️ Sandy Soil (Fast Drain)' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.pill, selectedSoil === item.id && styles.pillActive]}
                  onPress={() => {
                    setSelectedSoil(item.id);
                    fetchIrrigationAdvice(selectedCrop, item.id);
                  }}
                >
                  <Text style={[styles.pillText, selectedSoil === item.id && styles.pillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {irrigationLoading ? (
              <ActivityIndicator size="large" color="#166534" style={{ marginVertical: 16 }} />
            ) : irrigationData ? (
              <View style={styles.innerResultCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <View style={styles.irrigateBadge}>
                    <Text style={styles.irrigateBadgeText}>
                      Irrigate Today: {irrigationData.irrigateToday ? 'YES' : 'NO'}
                    </Text>
                  </View>
                  <Text style={styles.urgencyLabel}>Urgency: {irrigationData.urgency}</Text>
                </View>

                <View style={styles.twoColRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statSub}>Water Needed:</Text>
                    <Text style={styles.statMain}>💧 {irrigationData.waterVolumeLitersPerAcre} Liters / Acre</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statSub}>Best Timing Window:</Text>
                    <Text style={styles.statMain}>⏰ {irrigationData.bestTimingWindow}</Text>
                  </View>
                </View>

                {irrigationData.weather && (
                  <Text style={styles.weatherLine}>
                    Live Weather ({irrigationData.weather.cityName}): {irrigationData.weather.temperature}°C | 💧 {irrigationData.weather.humidity}% Humidity | ☁️ {irrigationData.weather.description}
                  </Text>
                )}

                <View style={styles.aiExplanationLine}>
                  <Text style={styles.aiExpText}>
                    💡 <Text style={{ fontWeight: 'bold' }}>Agronomist AI Explanation:</Text> {irrigationData.explanation}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* 3. Plant.id AI Leaf Scanner Card */}
          <View style={styles.yellowCard}>
            <Text style={styles.yellowCardTitle}>🔬 Plant.id AI Crop Leaf Disease Scanner</Text>

            <TouchableOpacity style={styles.scanBtn} onPress={scanLeaf} disabled={diseaseLoading}>
              <Text style={styles.btnText}>{diseaseLoading ? 'Analyzing Leaf Image...' : '📸 Upload & Scan Diseased Leaf Photo'}</Text>
            </TouchableOpacity>

            {diseaseResult ? (
              <View style={styles.innerResultCard}>
                <Text style={styles.diseaseNameText}>🌿 Disease: {diseaseResult.diseaseName}</Text>
                <Text style={styles.confidenceBadgeText}>AI Accuracy: {diseaseResult.confidencePercentage}% Confidence</Text>

                <Text style={styles.remedySubHeader}>🍃 Organic Neem Remedies:</Text>
                {diseaseResult.remedies?.organicNeem?.map((rem, idx) => (
                  <Text key={idx} style={styles.bulletItem}>• {rem}</Text>
                ))}

                <Text style={[styles.remedySubHeader, { color: '#991b1b', marginTop: 8 }]}>🧪 Chemical Pesticide Treatments:</Text>
                {diseaseResult.remedies?.chemical?.map((chem, idx) => (
                  <Text key={idx} style={styles.bulletItem}>• {chem}</Text>
                ))}
              </View>
            ) : null}
          </View>

          {/* 4. Twilio Bot Chat Simulator Card */}
          <View style={styles.purpleCard}>
            <Text style={styles.purpleCardTitle}>💬 Twilio WhatsApp & SMS Bot Chat Simulator</Text>
            <Text style={styles.subText}>Test sending SMS keywords to simulate responses received by 2G feature phones:</Text>

            <View style={styles.pillRow}>
              {['WATER', 'WEATHER', 'PRICE', 'DISEASE', 'HELP'].map((cmd) => (
                <TouchableOpacity key={cmd} style={styles.purplePill} onPress={() => { setBotCommand(cmd); sendBotCmd(cmd); }}>
                  <Text style={styles.purplePillText}>Send "{cmd}"</Text>
                </TouchableOpacity>
              ))}
            </View>

            {botMessage ? (
              <View style={styles.whatsappBox}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{botCommand}</Text>
                  <Text style={styles.bubbleTime}>{botTime} ✔✔</Text>
                </View>
                <View style={styles.botBubble}>
                  <Text style={styles.botBubbleText}>{botMessage}</Text>
                  <Text style={[styles.bubbleTime, { textAlign: 'right' }]}>{botTime}</Text>
                </View>
              </View>
            ) : null}
          </View>

        </View>

        {/* MEMBER 2: SMART INTEGRATIONS MODULE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>🌾 Smart Integrations Module</Text>

          {/* 1. Multilingual Switcher */}
          <View style={styles.moduleItem}>
            <Text style={styles.moduleItemTitle}>Multilingual Switcher</Text>
            <View style={styles.pillRow}>
              <TouchableOpacity style={styles.langPill}><Text style={styles.langPillText}>🌐 English</Text></TouchableOpacity>
              <TouchableOpacity style={styles.langPill}><Text style={styles.langPillText}>🇮🇳 Hindi (हिंदी)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.langPill}><Text style={styles.langPillText}>🌾 Bengali (বাংলা)</Text></TouchableOpacity>
            </View>
          </View>

          {/* 2. Voice Search */}
          <View style={styles.moduleItem}>
            <Text style={styles.moduleItemTitle}>Voice Search (Web Speech API)</Text>
            <View style={styles.rowForm}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={speechText}
                onChangeText={setSpeechText}
                placeholder="Spoken search term will appear here..."
              />
              <TouchableOpacity style={styles.greenBtn} onPress={() => setSpeechText('Mandi price of wheat in Kolkata')}>
                <Text style={styles.btnText}>🎙️ Speak</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. GPS Mandi Finder */}
          <View style={styles.moduleItem}>
            <Text style={styles.moduleItemTitle}>GPS Mandi Finder</Text>
            <TouchableOpacity style={styles.blueBtn} onPress={() => alert('GPS Coordinates: 28.6139 N, 77.2090 E (Kolkata Mandi)')}>
              <Text style={styles.btnText}>📍 Detect My Location Coordinates</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Net Profit Routing Calculator */}
          <View style={styles.moduleItem}>
            <Text style={styles.moduleItemTitle}>Net Profit Routing Calculator</Text>
            <Text style={styles.infoMessage}>Mandi: Kolkata Central Mandi | Crop: ₹30/kg | Transport Cost: ₹250 (Net Profit: ₹2,750 / Quintal)</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appShell: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    gap: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#166534',
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  blueCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 16,
  },
  blueCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 12,
  },
  greenCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 16,
  },
  greenCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803d',
  },
  yellowCard: {
    backgroundColor: '#fefce8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fef08a',
    padding: 16,
  },
  yellowCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a16207',
    marginBottom: 12,
  },
  purpleCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 16,
  },
  purpleCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b21a8',
    marginBottom: 4,
  },
  rowForm: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  blueBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  greenBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  scanBtn: {
    backgroundColor: '#ca8a04',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  refreshBtn: {
    backgroundColor: '#166534',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedRow: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#93c5fd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedUser: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  verifiedBadge: {
    fontSize: 11,
    color: '#0369a1',
    fontWeight: '600',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  logoutText: {
    fontSize: 11,
    color: '#475569',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  pillActive: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  pillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  purplePill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c084fc',
  },
  purplePillText: {
    fontSize: 12,
    color: '#6b21a8',
    fontWeight: '700',
  },
  innerResultCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86efac',
    marginTop: 12,
  },
  irrigateBadge: {
    backgroundColor: '#15803d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  irrigateBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
  },
  twoColRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  statSub: {
    fontSize: 11,
    color: '#64748b',
  },
  statMain: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  weatherLine: {
    fontSize: 12,
    color: '#047857',
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 4,
    marginVertical: 6,
  },
  aiExplanationLine: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 6,
  },
  aiExpText: {
    fontSize: 12,
    color: '#334155',
  },
  diseaseNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803d',
  },
  confidenceBadgeText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '700',
    marginBottom: 8,
  },
  remedySubHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 12,
    color: '#334155',
    marginVertical: 1,
  },
  subText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  infoMessage: {
    fontSize: 12,
    color: '#1e40af',
    marginTop: 8,
  },
  whatsappBox: {
    backgroundColor: '#efeae2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d9fdd3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  userBubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111b21',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botBubbleText: {
    fontSize: 12,
    color: '#111b21',
    lineHeight: 16,
  },
  bubbleTime: {
    fontSize: 9,
    color: '#667781',
    marginTop: 2,
  },
  moduleItem: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  moduleItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  langPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  langPillText: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '600',
  },
});
