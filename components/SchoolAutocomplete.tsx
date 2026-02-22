// components/SchoolAutocomplete.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SchoolResult, searchSchools } from "../lib/scorecard";

type SelectedSchool = {
  id: number;
  name: string;
  city?: string;
  state?: string;
};

export function SchoolAutocomplete({
  apiKey,
  value,
  onSelect,
  placeholder = "Search your school...",
}: {
  apiKey: string;
  value?: SelectedSchool | null;
  onSelect: (school: SelectedSchool) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value?.name) setQuery(value.name);
  }, [value?.name]);

  const showDropdown = useMemo(() => {
    const selectedName = value?.name ?? "";
    return query.trim().length >= 2 && query !== selectedName;
  }, [query, value?.name]);

  useEffect(() => {
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const r = await searchSchools({ apiKey, query: q, perPage: 12 });
        setResults(r);
      } catch (e: any) {
        setResults([]);
        setError(e?.message ?? "Could not load schools.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [apiKey, query]);

  return (
    <View style={styles.wrap}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        autoCapitalize="words"
        style={styles.input}
      />

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      {showDropdown && results.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const name = item["school.name"];
              const city = item["school.city"];
              const state = item["school.state"];
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onSelect({ id: item.id, name, city, state });
                    setResults([]);
                    setQuery(name);
                  }}
                >
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.meta}>
                    {city ? `${city}, ` : ""}
                    {state ?? ""}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(226,232,240,1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "white",
  },
  loadingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: "rgba(100,116,139,1)",
    fontWeight: "700",
  },
  error: { marginTop: 8, color: "#EF4444", fontWeight: "700" },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(226,232,240,1)",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    maxHeight: 280,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241,245,249,1)",
  },
  name: { fontSize: 14, fontWeight: "900", color: "#0F172A" },
  meta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(100,116,139,1)",
  },
});