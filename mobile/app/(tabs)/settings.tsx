import React, { useState } from "react";

import { View, Text, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from "react-native";
import { Toast } from 'react-native-toast-message/lib/src/Toast';


import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/context/ThemeContext";
import { getMnemonic } from "@/utils/api";

function SettingRow({
  icon,
  label,
  subtitle,
  value,
  onToggle,
  onPress,
  danger,
}: {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  subtitle?: string;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center justify-between rounded-[20px] border px-4 py-4"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-[12px]" style={{ backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F1F5F9' }}>
          <IconSymbol name={icon} size={20} color={danger ? theme.error : theme.muted} />
        </View>
        <View>
          <Text
            style={{ fontSize: 14, fontWeight: '700', color: danger ? theme.error : theme.text }}
          >
            {label}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 11, color: theme.muted, fontWeight: '600', marginTop: 2 }}>{subtitle}</Text>
          )}
        </View>
      </View>
      {onToggle !== undefined && value !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: theme.primary + '66' }}
          thumbColor={value ? theme.primary : theme.muted}
        />
      ) : (
        <IconSymbol name={onPress ? "chevron.right" : "info.circle"} size={16} color={theme.muted} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { toggleTheme } = useTheme();
  
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  
  const [notifications, setNotifications] = useState(true);
  const [soundFx, setSoundFx] = useState(true);

  const fetchMnemonic = async () => {
    try {
      setLoading(true);
      const data = await getMnemonic();
      setMnemonic(data.mnemonic || "Mnemonic not found");
      setShowMnemonic(true);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch mnemonic'
      });
    } finally {



      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* ── Header ── */}
        <View className="mb-8 mt-2">
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.primary }}>
              Settings
            </Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '900', color: theme.text }}>
            Preferences<Text style={{ color: theme.primary }}>.</Text>
          </Text>
        </View>

        {/* ── Theme Toggle ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.muted }}>
          Appearance
        </Text>
        <View className="mb-6">
          <SettingRow
            icon="moon.fill"
            label="Dark Mode"
            subtitle="Enable premium dark aesthetic"
            value={colorScheme === 'dark'}
            onToggle={toggleTheme}
          />
        </View>

        {/* ── Security Section ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.muted }}>
          Security
        </Text>
        <View className="mb-6 gap-y-3">
          <TouchableOpacity
            onPress={fetchMnemonic}
            className="rounded-[20px] border p-5"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-[12px]" style={{ backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F1F5F9' }}>
                <IconSymbol name="lock.fill" size={20} color={theme.primary} />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 14, fontWeight: '900', color: theme.text }}>Mnemonic Phrase</Text>
                <Text style={{ fontSize: 11, color: theme.muted, fontWeight: '600', marginTop: 2 }}>View your recovery phrase</Text>
              </View>
              {loading ? <ActivityIndicator size="small" color={theme.primary} /> : <IconSymbol name="chevron.right" size={16} color={theme.muted} />}
            </View>
            {showMnemonic && (
              <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: theme.background }}>
                <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700', lineHeight: 20 }}>{mnemonic}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Game Settings ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.muted }}>
          Game
        </Text>
        <View className="mb-6 gap-y-3">
          <SettingRow
            icon="bell.fill"
            label="Notifications"
            value={notifications}
            onToggle={setNotifications}
          />
          <SettingRow
            icon="speaker.wave.3.fill"
            label="Sound Effects"
            value={soundFx}
            onToggle={setSoundFx}
          />
        </View>

        {/* ── App Info ── */}
        <Text style={{ marginBottom: 16, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 3, color: theme.muted }}>
          App
        </Text>
        <View className="mb-6 gap-y-3">
          <SettingRow icon="info.circle.fill" label="Version" subtitle="v1.0.0 · HUEFI Mobile" />
        </View>

        {/* ── Danger Zone ── */}
        <TouchableOpacity
          className="items-center rounded-[20px] border py-5"
          style={{ borderColor: theme.error + '33', backgroundColor: theme.error + '15' }}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 15, fontWeight: '900', color: theme.error, textTransform: 'uppercase', letterSpacing: 1 }}>
            Disconnect Wallet
          </Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 32, textAlign: 'center', fontSize: 10, textTransform: 'uppercase', fontWeight: '900', letterSpacing: 1.5, color: theme.muted }}>
          HUEFI · Color Staking AI App
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}