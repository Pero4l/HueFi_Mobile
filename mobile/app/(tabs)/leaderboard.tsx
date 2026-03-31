import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getLeaderboard } from '@/utils/api';

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      // Assuming the API returns similar structure to LEADERBOARD_DATA
      // If it returns a list directly, we use it.
      setLeaderboardData(data.rankings || data.leaderboard || []);
    } catch (error: any) {
      console.error("Leaderboard fetch error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load leaderboard'
      });
    } finally {

      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <View className="flex-row items-center mx-4 my-2 p-4 rounded-2xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
      <View className="w-8 items-center justify-center">
        <Text style={{ color: theme.muted, fontWeight: 'bold', fontSize: 18 }}>{index + 1}</Text>
      </View>
      <Image 
        source={{ uri: item.avatar || `https://i.pravatar.cc/150?u=${item.id || index}` }} 
        className="w-12 h-12 rounded-full mx-3 border"
        style={{ borderColor: theme.border }}
      />
      <View className="flex-1">
        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 16 }}>{item.username || item.name}</Text>
        <Text style={{ color: theme.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Top Player</Text>
      </View>
      <View className="items-end">
        <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 18 }}>{item.wins || 0}</Text>
        <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800' }}>WINS</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="px-6 pt-10 pb-6 flex-row items-center justify-between">
        <View>
          <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 3 }}>Rankings</Text>
          <Text style={{ color: theme.text, fontSize: 32, fontWeight: '900', marginTop: 4 }}>Leaderboard</Text>
        </View>
        <View className="p-3 rounded-2xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <IconSymbol name="trophy.fill" size={24} color={theme.primary} />
        </View>
      </View>

      <FlatList
        data={leaderboardData}
        ListHeaderComponent={() => (
          leaderboardData.length >= 3 ? (
            <View className="flex-row justify-around items-end px-4 py-8 mb-4">
              {/* 2nd Place */}
              <View className="items-center">
                <View className="relative">
                   <Image source={{ uri: leaderboardData[1].avatar || `https://i.pravatar.cc/150?u=2` }} className="w-16 h-16 rounded-full border-2" style={{ borderColor: theme.muted }} />
                   <View className="absolute -bottom-2 self-center px-2 rounded-full" style={{ backgroundColor: theme.muted }}>
                      <Text className="text-black font-bold text-xs">2</Text>
                   </View>
                </View>
                <Text style={{ color: theme.text, marginTop: 12, fontWeight: '700', fontSize: 13 }}>{leaderboardData[1].username || leaderboardData[1].name}</Text>
                <Text style={{ color: theme.primary, fontWeight: '800' }}>{leaderboardData[1].wins || 0}</Text>
              </View>

              {/* 1st Place */}
              <View className="items-center pb-4">
                <View className="relative">
                   <Image source={{ uri: leaderboardData[0].avatar || `https://i.pravatar.cc/150?u=1` }} className="w-20 h-20 rounded-full border-4" style={{ borderColor: theme.primary }} />
                   <View className="absolute -top-6 self-center">
                      <IconSymbol name="trophy.fill" size={30} color={theme.secondary} />
                   </View>
                   <View className="absolute -bottom-2 self-center px-3 rounded-full" style={{ backgroundColor: theme.primary }}>
                      <Text className="text-black font-bold text-sm">1</Text>
                   </View>
                </View>
                <Text style={{ color: theme.text, marginTop: 16, fontWeight: '900', fontSize: 14 }}>{leaderboardData[0].username || leaderboardData[0].name}</Text>
                <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 18 }}>{leaderboardData[0].wins || 0}</Text>
              </View>

              {/* 3rd Place */}
              <View className="items-center">
                <View className="relative">
                   <Image source={{ uri: leaderboardData[2].avatar || `https://i.pravatar.cc/150?u=3` }} className="w-16 h-16 rounded-full border-2" style={{ borderColor: theme.accent }} />
                   <View className="absolute -bottom-2 self-center px-2 rounded-full" style={{ backgroundColor: theme.accent }}>
                      <Text className="text-white font-bold text-xs">3</Text>
                   </View>
                </View>
                <Text style={{ color: theme.text, marginTop: 12, fontWeight: '700', fontSize: 13 }}>{leaderboardData[2].username || leaderboardData[2].name}</Text>
                <Text style={{ color: theme.primary, fontWeight: '800' }}>{leaderboardData[2].wins || 0}</Text>
              </View>
            </View>
          ) : null
        )}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
