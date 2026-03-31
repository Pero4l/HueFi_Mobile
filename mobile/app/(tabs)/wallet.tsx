import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Toast } from 'react-native-toast-message/lib/src/Toast';


import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getBalance, getTransactions } from "@/utils/api";

export default function WalletScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [balance, setBalance] = useState({ balance: 0, lamports: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balData, transData] = await Promise.all([
        getBalance(),
        getTransactions()
      ]);
      setBalance(balData);
      setTransactions(transData.transactions || []);
    } catch (error: any) {
      console.error("Wallet data fetch error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load wallet data'
      });
    } finally {

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingTop: 40, paddingBottom: 100 }}
      >
        {/* ── Header ── */}
        <View className="mb-6 mt-2">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.primary }}>
              Wallet
            </Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '900', color: theme.text }}>
            Your <Text style={{ color: theme.primary }}>Balance.</Text>
          </Text>
        </View>

        {/* ── Balance Card ── */}
        <View className="mb-4 rounded-[24px] border p-6" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <Text style={{ marginBottom: 4, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, color: theme.muted }}>
            Total Balance
          </Text>
          <Text style={{ fontSize: 44, fontWeight: '900', color: theme.text }}>
            {balance.balance.toFixed(2)}
            <Text style={{ fontSize: 20, color: theme.muted }}> HUE</Text>
          </Text>
          <View className="mt-4 flex-row items-center gap-2 rounded-[12px] px-4 py-3" style={{ backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F1F5F9' }}>
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            <Text className="flex-1" style={{ fontSize: 12, fontWeight: '700', color: theme.muted }}>
              0x0164...e03c
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 11, fontWeight: '900', color: theme.primary }}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Action Buttons ── */}
        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 rounded-[18px] py-4"
            style={{ backgroundColor: theme.primary }}
            activeOpacity={0.85}
          >
            <IconSymbol name="arrow.down.circle.fill" size={18} color="#000" />
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#000' }}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 rounded-[18px] border py-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            activeOpacity={0.85}
          >
            <IconSymbol name="arrow.up.circle.fill" size={18} color={theme.text} />
            <Text style={{ fontSize: 15, fontWeight: '900', color: theme.text }}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* ── Transaction History ── */}
        <Text style={{ marginBottom: 16, fontSize: 14, fontWeight: '900', color: theme.text }}>
          Recent Transactions
        </Text>
        <View className="gap-y-3">
          {transactions.map((tx, idx) => (
            <View
              key={idx}
              className="flex-row items-center justify-between rounded-[16px] border px-4 py-4"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-[12px]" style={{ backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F1F5F9' }}>
                  <IconSymbol name={tx.type === 'Receive' ? "arrow.down.circle.fill" : "arrow.up.circle.fill"} size={20} color={tx.type === 'Receive' ? theme.success : theme.error} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{tx.type}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: theme.muted, marginTop: 2 }}>{tx.date}</Text>
                </View>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: '900', color: tx.type === 'Receive' ? theme.success : theme.error }}
              >
                {tx.type === 'Receive' ? "+" : "-"}{tx.amount} HUE
              </Text>
            </View>
          ))}
          {transactions.length === 0 && (
            <Text style={{ textAlign: 'center', color: theme.muted, marginTop: 20 }}>No transactions yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}