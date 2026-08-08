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

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('IRRIGATION'); // AUTH | IRRIGATION | DISEASE | BOT
  const [backendHealth, setBackendHealth] = useState('Checking...');

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

  useEffect(() => {
    // Check Backend Health
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => setBackendHealth(data.message || 'Server Active'))
      .catch(() => setBackendHealth('Offline (Ensure node server.js is running)'));

    // Initial Irrigation Fetch
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
          setAuthMessage('Verified successfully! 30-Day Encrypted Session Active.');
        } else {
          setAuthMessage(data.error || 'Invalid OTP');
        }
      })
      .catch(() => {
        setAuthLoading(false);
        setAuthMessage('Network error verifying OTP');
      });
  };

  const scanLeaf = (sampleType) => {
    setDiseaseLoading(true);
    // Mock Base64 sample for Plant.id API test
    const dummyBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
    fetch(`${API_BASE_URL}/disease/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dummyBase64 })
    })
      .then((res) => res.json())
      .then((data) => {
        setDiseaseLoading(false);
        if (data.success) {
          setDiseaseResult(data.data);
        }
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
        text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        setBotMessage(text);
        setBotTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      })
      .catch(() => setBotMessage('Failed to connect to Twilio webhook endpoint'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064e3b" />

      {/* App Top Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌾 KrishiSync Mobile</Text>
        <Text style={styles.headerSub}>Native React Native • Track 03 (IEMH4-AG-01)</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Server: {backendHealth.substring(0, 30)}</Text>
        </View>
      </View>

      {/* Main Tab Navigation Bar */}
      <View style={styles.tabBar}>
        {[
          { id: 'IRRIGATION', label: '🌧️ Irrigation' },
          { id: 'DISEASE', label: '🔬 AI Disease' },
          { id: 'AUTH', label: '📱 OTP Login' },
          { id: 'BOT', label: '💬 Twilio Bot' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

        {/* TAB 1: SMART IRRIGATION */}
        {activeTab === 'IRRIGATION' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌧️ Smart Rule-Based Irrigation Advisory Engine</Text>
            <Text style={styles.cardDesc}>
              Hyperlocal weather calculation with soil evapotranspiration retention factors.
            </Text>

            <Text style={styles.label}>Select Crop:</Text>
            <View style={styles.pillRow}>
              {['wheat', 'mustard', 'rice', 'cotton'].map((crop) => (
                <TouchableOpacity
                  key={crop}
                  style={[styles.pill, selectedCrop === crop && styles.pillActive]}
                  onPress={() => {
                    setSelectedCrop(crop);
                    fetchIrrigationAdvice(crop, selectedSoil);
                  }}
                >
                  <Text style={[styles.pillText, selectedCrop === crop && styles.pillTextActive]}>
                    {crop.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Select Soil Type:</Text>
            <View style={styles.pillRow}>
              {['loam', 'clay', 'sandy'].map((soil) => (
                <TouchableOpacity
                  key={soil}
                  style={[styles.pill, selectedSoil === soil && styles.pillActive]}
                  onPress={() => {
                    setSelectedSoil(soil);
                    fetchIrrigationAdvice(selectedCrop, soil);
                  }}
                >
                  <Text style={[styles.pillText, selectedSoil === soil && styles.pillTextActive]}>
                    {soil.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {irrigationLoading ? (
              <ActivityIndicator size="large" color="#059669" style={{ marginVertical: 20 }} />
            ) : irrigationData ? (
              <View style={styles.resultBox}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricValue}>
                    Irrigate Today: <Text style={{ color: '#059669', fontWeight: 'bold' }}>{irrigationData.irrigateToday ? 'YES' : 'NO'}</Text>
                  </Text>
                  <Text style={styles.urgencyBadge}>{irrigationData.urgency} URGENCY</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailTitle}>💧 Water Needed:</Text>
                  <Text style={styles.detailText}>{irrigationData.waterVolumeLitersPerAcre} Liters / Acre</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailTitle}>⏰ Best Window:</Text>
                  <Text style={styles.detailText}>{irrigationData.bestTimingWindow}</Text>
                </View>

                {irrigationData.weather && (
                  <View style={styles.weatherInfoBox}>
                    <Text style={styles.weatherText}>
                      🌡️ {irrigationData.weather.temperature}°C  |  💧 {irrigationData.weather.humidity}% Humidity  |  ☁️ {irrigationData.weather.description}
                    </Text>
                  </View>
                )}

                <View style={styles.aiBox}>
                  <Text style={styles.aiTitle}>💡 Agronomist AI Explanation:</Text>
                  <Text style={styles.aiBody}>{irrigationData.explanation}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* TAB 2: AI LEAF DISEASE SCANNER */}
        {activeTab === 'DISEASE' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔬 Plant.id AI Crop Leaf Scanner</Text>
            <Text style={styles.cardDesc}>
              Instant 94%+ accuracy leaf disease diagnosis & Neem organic remedies.
            </Text>

            <TouchableOpacity style={styles.actionBtn} onPress={() => scanLeaf('sample')}>
              <Text style={styles.actionBtnText}>📸 Run AI Leaf Scan Test</Text>
            </TouchableOpacity>

            {diseaseLoading ? (
              <ActivityIndicator size="large" color="#059669" style={{ marginVertical: 20 }} />
            ) : diseaseResult ? (
              <View style={styles.resultBox}>
                <Text style={styles.diseaseName}>🌿 Disease: {diseaseResult.diseaseName}</Text>
                <Text style={styles.confidenceText}>AI Confidence: {diseaseResult.confidencePercentage}%</Text>

                <View style={styles.remedyBox}>
                  <Text style={styles.remedyHeader}>🍃 Organic Neem Remedies:</Text>
                  {diseaseResult.remedies?.organicNeem?.map((rem, idx) => (
                    <Text key={idx} style={styles.bulletText}>• {rem}</Text>
                  ))}
                </View>

                <View style={[styles.remedyBox, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                  <Text style={[styles.remedyHeader, { color: '#991b1b' }]}>🧪 Chemical Treatments:</Text>
                  {diseaseResult.remedies?.chemical?.map((chem, idx) => (
                    <Text key={idx} style={[styles.bulletText, { color: '#7f1d1d' }]}>• {chem}</Text>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Tap above to run instant Plant.id AI leaf scan demo.</Text>
            )}
          </View>
        )}

        {/* TAB 3: PHONE OTP AUTH */}
        {activeTab === 'AUTH' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📱 Farmer Mobile OTP Login (Twilio SMS)</Text>
            <Text style={styles.cardDesc}>
              No passwords needed. 1-Click login for rural smallholder farmers.
            </Text>

            {authStep === 'SEND' && (
              <View>
                <Text style={styles.label}>Mobile Number:</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.actionBtn} onPress={handleSendOtp} disabled={authLoading}>
                  <Text style={styles.actionBtnText}>{authLoading ? 'Sending SMS...' : '📲 Send OTP SMS'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'VERIFY' && (
              <View>
                <Text style={styles.label}>Enter 6-Digit OTP:</Text>
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  placeholder="e.g. 123456"
                />
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16a34a' }]} onPress={handleVerifyOtp} disabled={authLoading}>
                  <Text style={styles.actionBtnText}>{authLoading ? 'Verifying...' : '✅ Verify OTP'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {authStep === 'LOGGED_IN' && authUser && (
              <View style={styles.verifiedBox}>
                <Text style={styles.verifiedTitle}>🎉 Verified Farmer: {authUser.name}</Text>
                <Text style={styles.verifiedPhone}>Mobile: {authUser.phoneNumber}</Text>
                <Text style={styles.verifiedStatus}>🔒 Session Status: Active (30-Day Encrypted Auth)</Text>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => { setAuthStep('SEND'); setAuthUser(null); }}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}

            {authMessage ? <Text style={styles.messageText}>{authMessage}</Text> : null}
          </View>
        )}

        {/* TAB 4: TWILIO BOT */}
        {activeTab === 'BOT' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💬 Twilio SMS & WhatsApp Bot Simulator</Text>
            <Text style={styles.cardDesc}>
              Features 2G feature phone access for farmers without smartphones.
            </Text>

            <View style={styles.pillRow}>
              {['WATER', 'WEATHER', 'PRICE', 'DISEASE', 'HELP'].map((cmd) => (
                <TouchableOpacity
                  key={cmd}
                  style={[styles.pill, botCommand === cmd && styles.pillActive]}
                  onPress={() => {
                    setBotCommand(cmd);
                    sendBotCmd(cmd);
                  }}
                >
                  <Text style={[styles.pillText, botCommand === cmd && styles.pillTextActive]}>
                    "{cmd}"
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {botMessage ? (
              <View style={styles.chatContainer}>
                {/* Outgoing */}
                <View style={styles.outgoingBubble}>
                  <Text style={styles.outgoingText}>{botCommand}</Text>
                  <Text style={styles.chatTime}>{botTime} ✔✔</Text>
                </View>

                {/* Inbound Reply */}
                <View style={styles.incomingBubble}>
                  <Text style={styles.incomingText}>{botMessage}</Text>
                  <Text style={[styles.chatTime, { textAlign: 'right' }]}>{botTime}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#064e3b',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#064e3b',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 12,
    color: '#a7f3d0',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#022c22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    color: '#6ee7b7',
    fontSize: 11,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#047857',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#ecfdf5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d1fae5',
  },
  tabTextActive: {
    color: '#065f46',
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
  },
  cardDesc: {
    fontSize: 12,
    color: '#4b5563',
    marginVertical: 6,
  },
  label: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  pillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  pillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  urgencyBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '800',
  },
  detailRow: {
    marginVertical: 4,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  detailText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  weatherInfoBox: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
  },
  weatherText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  aiBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#a7f3d0',
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
  },
  aiBody: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 12,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803d',
  },
  confidenceText: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 8,
  },
  remedyBox: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  remedyHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 12,
    color: '#374151',
    marginVertical: 2,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 4,
  },
  verifiedBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#6ee7b7',
    marginTop: 12,
  },
  verifiedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803d',
  },
  verifiedPhone: {
    fontSize: 12,
    color: '#374151',
  },
  verifiedStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  messageText: {
    fontSize: 12,
    color: '#1e40af',
    marginTop: 8,
  },
  chatContainer: {
    marginTop: 12,
    backgroundColor: '#efeae2',
    padding: 12,
    borderRadius: 8,
  },
  outgoingBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d9fdd3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  outgoingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111b21',
  },
  incomingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  incomingText: {
    fontSize: 13,
    color: '#111b21',
  },
  chatTime: {
    fontSize: 9,
    color: '#667781',
    marginTop: 4,
  },
});
