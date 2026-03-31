import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Toast } from 'react-native-toast-message/lib/src/Toast';



import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";



const COLORS = [
  { id: "red", label: "Red", bg: "#EF4444", multiplier: "2x" },
  { id: "blue", label: "Blue", bg: "#3B82F6", multiplier: "2x" },
  { id: "green", label: "Green", bg: "#22C55E", multiplier: "2x" },
  { id: "yellow", label: "Yellow", bg: "#EAB308", multiplier: "2x" },
];

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

const COLOR_DOT: Record<string, string> = {

  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
};

export default function GameScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("10");
  const [currency, setCurrency] = useState<'USD' | 'SOL'>('USD');
  const [balances, setBalances] = useState({ USD: 1000, SOL: 50 });
  const [countdown, setCountdown] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultColor, setResultColor] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);


  const handlePlaceStake = React.useCallback(() => {
    if (!selectedColor) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a color first'
      });
      return;
    }
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid stake amount'
      });
      return;
    }
    if (amount > balances[currency]) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Insufficient ${currency} balance`
      });
      return;
    }


    // Deduct stake
    setBalances(prev => ({
      ...prev,
      [currency]: prev[currency] - amount
    }));

    setIsSpinning(true);
    setCountdown(10);
    setResultColor(null);
  }, [selectedColor, stakeAmount, currency, balances]);


  const revealResult = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    const winColor = COLORS[randomIndex].id;
    setResultColor(winColor);
    setIsSpinning(false);

    const amount = parseFloat(stakeAmount);
    const won = winColor === selectedColor;
    if (won) {
      setBalances(prev => ({
        ...prev,
        [currency]: prev[currency] + (amount * 2)
      }));
      Toast.show({
        type: 'success',
        text1: 'Winner!',
        text2: `The color was ${winColor.toUpperCase()}. You won ${amount * 2} ${currency}!`
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Game Over',
        text2: `The color was ${winColor.toUpperCase()}. Better luck next time!`
      });
    }


    setHistory(prev => [{
      id: Date.now(),
      picked: selectedColor,
      result: winColor,
      amount: amount,
      won: won,
      currency: currency
    }, ...prev]);
  }, [selectedColor, stakeAmount, currency]);


  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isSpinning) {
      revealResult();
    }
    return () => clearTimeout(timer);
  }, [countdown, isSpinning, revealResult]);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingTop: 20, paddingBottom: 100 }}
      >
        {/* ── Header ── */}
        <View className="mb-10 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="flex-row flex-wrap" style={{ width: 32, height: 32, gap: 4 }}>
              {["#EF4444","#3B82F6","#22C55E","#EAB308"].map((c) => (
                <View key={c} style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: c, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              ))}
            </View>
            <View>
              <Text className="text-3xl font-[900] italic tracking-tighter" style={{ color: theme.text, textShadowColor: theme.primary + '44', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>HUEFI</Text>
              <View className="flex-row items-center gap-1.5">
                <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                <Text style={{ color: theme.primary, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3 }}>
                  Mainnet Live
                </Text>
              </View>
            </View>
          </View>
          <View className="items-end px-5 py-2.5 rounded-2xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <Text className="text-xl font-black" style={{ color: theme.primary }}>
              {balances[currency].toFixed(2)}{" "}
              <Text style={{ fontSize: 10, fontWeight: '700', color: theme.muted }}>{currency}</Text>
            </Text>
            <Text style={{ fontSize: 9, fontWeight: '900', color: theme.muted, textTransform: 'uppercase', letterSpacing: 1.5 }}>Available</Text>
          </View>
        </View>

        {/* ── Currency Switcher ── */}
        <View className="mb-6 flex-row gap-3">
          {(['USD', 'SOL'] as const).map((curr) => (
            <TouchableOpacity
              key={curr}
              onPress={() => setCurrency(curr)}
              className="flex-1 items-center justify-center rounded-2xl py-4 border"
              style={{
                backgroundColor: currency === curr ? theme.primary + "15" : theme.surface,
                borderColor: currency === curr ? theme.primary : theme.border,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '900', color: currency === curr ? theme.primary : theme.muted }}>{curr}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Wallet Badge ── */}
        <View className="mb-10 flex-row items-center justify-between rounded-[28px] border px-6 py-5 shadow-2xl" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <View className="flex-row items-center gap-4">
            <View className="h-2.5 w-2.5 rounded-full shadow-lg" style={{ backgroundColor: theme.primary, shadowColor: theme.primary }} />
            <View>
              <Text style={{ fontSize: 10, fontWeight: '900', color: theme.muted, textTransform: 'uppercase', letterSpacing: 2 }}>Connected Wallet</Text>
              <Text className="text-sm font-bold tracking-tight mt-0.5" style={{ color: theme.text }}>0x0164...e03c</Text>
            </View>
          </View>
          <TouchableOpacity className="rounded-xl px-4 py-2.5 border" style={{ backgroundColor: colorScheme === 'dark' ? '#111' : '#F1F5F9', borderColor: theme.border }}>
            <Text style={{ fontSize: 9, fontWeight: '900', color: theme.muted, letterSpacing: 1.5, textTransform: 'uppercase' }}>Disconnect</Text>
          </TouchableOpacity>
        </View>

        {/* ── Game Display ── */}
        <View className="mb-10 items-center justify-center rounded-[40px] border py-16 shadow-2xl" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          {isSpinning ? (
             <View className="items-center gap-6">
                <Text className="text-6xl font-black" style={{ color: theme.primary }}>{countdown}</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: theme.muted, textTransform: 'uppercase', letterSpacing: 4 }}>Revealing soon...</Text>
             </View>
          ) : resultColor ? (
            <View className="items-center gap-6">
              <View
                className="h-28 w-28 rounded-full"
                style={{ 
                   backgroundColor: COLOR_DOT[resultColor],
                   shadowColor: COLOR_DOT[resultColor],
                   shadowOffset: { width: 0, height: 0 },
                   shadowOpacity: 1,
                   shadowRadius: 30,
                   elevation: 25,
                   borderWidth: 4,
                   borderColor: 'rgba(255,255,255,0.2)'
                }}
              />
              <View className="items-center">
                <Text style={{ fontSize: 24, fontWeight: '900', color: theme.text, letterSpacing: -0.5 }}>
                  {resultColor.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: theme.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 3 }}>Winning Color</Text>
              </View>
            </View>
          ) : selectedColor ? (
            <View className="items-center gap-6">
              <View
                className="h-28 w-28 rounded-full"
                style={{ 
                   backgroundColor: COLOR_DOT[selectedColor],
                   shadowColor: COLOR_DOT[selectedColor],
                   shadowOffset: { width: 0, height: 0 },
                   shadowOpacity: 1,
                   shadowRadius: 30,
                   elevation: 25,
                   borderWidth: 4,
                   borderColor: 'rgba(255,255,255,0.2)'
                }}
              />
              <View className="items-center">
                <Text style={{ fontSize: 24, fontWeight: '900', color: theme.text, letterSpacing: -0.5 }}>
                  {selectedColor.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: theme.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 3 }}>Selected Color</Text>
              </View>
            </View>
          ) : (
            <View className="items-center gap-6">
              <View className="flex-row gap-5">
                {Object.entries(COLOR_DOT).map(([key, color]) => (
                  <View key={key} className="h-5 w-5 rounded-full border border-white/5 shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </View>
              <Text style={{ fontSize: 13, fontWeight: '900', color: theme.muted, textTransform: 'uppercase', letterSpacing: 4 }}>Choose your Hue</Text>
            </View>
          )}
        </View>

        {/* ── Pick a Color ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 4, color: theme.muted, paddingHorizontal: 4 }}>
          Pick a Color
        </Text>
        <View className="mb-10 flex-row gap-3">
          {COLORS.map((color) => {
            const isSelected = selectedColor === color.id;
            return (
              <TouchableOpacity
                key={color.id}
                onPress={() => setSelectedColor(color.id)}
                className="flex-1 items-center rounded-[28px] py-7"
                style={{
                  backgroundColor: isSelected ? color.bg + "20" : theme.surface,
                  borderWidth: 1.5,
                  borderColor: isSelected ? color.bg : theme.border,
                }}
                activeOpacity={0.8}
              >
                <View
                  className="mb-3 h-12 w-12 rounded-full border-2 border-black/30"
                  style={{ backgroundColor: color.bg, shadowColor: color.bg, shadowOpacity: isSelected ? 0.5 : 0, shadowRadius: 10, elevation: isSelected ? 5 : 0 }}
                />
                <Text style={{ fontSize: 12, fontWeight: '800', color: theme.text, letterSpacing: -0.2 }}>{color.label}</Text>
                <Text style={{ marginTop: 4, fontSize: 10, fontWeight: '900', color: color.bg }}>
                  {color.multiplier}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Stake Amount ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 4, color: theme.muted, paddingHorizontal: 4 }}>
          Stake Amount
        </Text>
        <View className="mb-5 relative">
          <TextInput
            value={stakeAmount}
            onChangeText={setStakeAmount}
            keyboardType="numeric"
            placeholderTextColor={theme.muted}
            editable={!isSpinning}
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              paddingHorizontal: 28,
              paddingVertical: 24,
              fontSize: 24,
              fontWeight: '900',
              color: theme.text,
            }}
          />
          <View className="absolute right-7 top-6">
            <Text style={{ color: theme.muted, fontWeight: '900', fontSize: 20 }}>{currency}</Text>
          </View>
        </View>

        {/* ── Quick Amounts ── */}
        <View className="mb-10 flex-row flex-wrap gap-3">
          {QUICK_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              onPress={() => setStakeAmount(String(amt))}
              disabled={isSpinning}
              className="rounded-2xl px-6 py-3.5"
              style={{
                borderWidth: 1.5,
                borderColor: stakeAmount === String(amt) ? theme.primary : theme.border,
                backgroundColor: stakeAmount === String(amt) ? theme.primary + "15" : theme.surface,
                opacity: isSpinning ? 0.5 : 1
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '900', color: stakeAmount === String(amt) ? theme.primary : theme.muted }}
              >
                {amt}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setStakeAmount(String(balances[currency]))}
            disabled={isSpinning}
            className="rounded-2xl border px-6 py-3.5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border, opacity: isSpinning ? 0.5 : 1 }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: '900', color: theme.muted }}>MAX</Text>
          </TouchableOpacity>
        </View>

        {/* ── Place Bet Button ── */}
        <TouchableOpacity
          onPress={handlePlaceStake}
          className="mb-10 items-center justify-center rounded-[24px] py-6 shadow-lg"
          style={{
            backgroundColor: selectedColor && !isSpinning ? theme.primary : theme.border,
            shadowColor: theme.primary,
            shadowOpacity: selectedColor && !isSpinning ? 0.4 : 0,
            shadowRadius: 15,
            elevation: selectedColor && !isSpinning ? 8 : 0,
          }}
          activeOpacity={0.85}
          disabled={!selectedColor || isSpinning}
        >
          <Text
            style={{ fontSize: 18, fontWeight: '900', color: selectedColor && !isSpinning ? '#000' : theme.muted, textTransform: 'uppercase', letterSpacing: 2 }}
          >
            {isSpinning ? "Game In Progress..." : (selectedColor ? "Place Stake" : "Select Color")}
          </Text>
        </TouchableOpacity>

        {/* ── Game History ── */}
        <View className="flex-row items-center justify-between mb-4 px-1">
           <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 4, color: theme.muted }}>
             History
           </Text>
           <TouchableOpacity>
             <Text style={{ fontSize: 10, fontWeight: '800', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1.5 }}>View All</Text>
           </TouchableOpacity>
        </View>

        <View className="gap-y-4">
          {history.length > 0 ? (
            history.map((game) => (
              <View
                key={game.id}
                className="flex-row items-center justify-between rounded-[24px] border px-6 py-6"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
              >
                <View className="flex-row items-center gap-5">
                  <View className="w-12 h-12 items-center justify-center rounded-2xl border" style={{ backgroundColor: colorScheme === 'dark' ? '#111' : '#F1F5F9', borderColor: theme.border }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: theme.muted }}>#{String(game.id).slice(-4)}</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: COLOR_DOT[game.picked] }} />
                    <Text style={{ color: theme.muted, fontWeight: '900', fontSize: 18 }}>→</Text>
                    <View className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: COLOR_DOT[game.result] }} />
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    style={{ fontSize: 18, fontWeight: '900', color: game.won ? theme.success : theme.error }}
                  >
                    {game.won ? "+" : "-"}{game.amount}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: theme.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{game.currency}</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-10 rounded-[24px] border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              <Text style={{ color: theme.muted, fontWeight: '800' }}>No games played yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}