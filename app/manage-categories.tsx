import React, { useState } from 'react';
import {
  View, Text, FlatList, Pressable, TextInput, Switch, Modal, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';
import { useCategories } from '../src/hooks/useCategories';
import type { ExpenseCategory } from '../src/models/category';

const EMOJI_OPTIONS = [
  '🍚', '🍽️', '🏠', '⚡', '🚗', '🧴', '👕', '🤝',
  '🎮', '🎬', '💇', '📦', '🏥', '📱', '💰', '🎓',
  '✈️', '🏋️', '🐶', '💊', '🎁', '📚', '☕', '🛒',
];

export default function ManageCategoriesScreen() {
  const router = useRouter();
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
  } = useCategories();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [isFixed, setIsFixed] = useState(false);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setEmoji('📦');
    setIsFixed(false);
    setShowModal(true);
  };

  const openEditModal = (cat: ExpenseCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setEmoji(cat.emoji);
    setIsFixed(cat.isFixed);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: name.trim(),
        emoji,
        isFixed,
      });
    } else {
      await addCategory(name.trim(), emoji, isFixed);
    }
    setShowModal(false);
  };

  const handleDelete = (cat: ExpenseCategory) => {
    if (cat.isDefault) return;
    Alert.alert(`${cat.name}を削除しますか？`, 'この操作は取り消せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => deleteCategory(cat.id),
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: ExpenseCategory; index: number }) => (
    <View style={styles.itemRow}>
      {/* Delete button (only for non-default) */}
      {!item.isDefault ? (
        <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Text style={styles.deleteButtonText}>−</Text>
        </Pressable>
      ) : (
        <View style={styles.deletePlaceholder} />
      )}

      {/* Category info - tap to edit */}
      <Pressable style={styles.itemContent} onPress={() => openEditModal(item)}>
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.isFixed && <Text style={styles.fixedBadge}>固定費</Text>}
      </Pressable>

      {/* Reorder buttons */}
      <View style={styles.reorderButtons}>
        <Pressable
          style={[styles.reorderButton, index === 0 && styles.reorderDisabled]}
          onPress={() => moveCategory(item.id, 'up')}
          disabled={index === 0}
        >
          <Text style={[styles.reorderText, index === 0 && styles.reorderTextDisabled]}>↑</Text>
        </Pressable>
        <Pressable
          style={[styles.reorderButton, index === categories.length - 1 && styles.reorderDisabled]}
          onPress={() => moveCategory(item.id, 'down')}
          disabled={index === categories.length - 1}
        >
          <Text style={[styles.reorderText, index === categories.length - 1 && styles.reorderTextDisabled]}>↓</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>閉じる</Text>
        </Pressable>
        <Text style={styles.headerTitle}>カテゴリー編集</Text>
        <View style={styles.headerRight} />
      </View>

      {/* List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <Pressable style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.addButtonText}>＋ カテゴリー追加</Text>
          </Pressable>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'カテゴリーを編集' : 'カテゴリーを追加'}
            </Text>

            {/* Name */}
            <Text style={styles.modalLabel}>カテゴリ名</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="例：医療費"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            {/* Emoji */}
            <Text style={styles.modalLabel}>アイコン</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((e) => (
                <Pressable
                  key={e}
                  style={[styles.emojiButton, emoji === e && styles.emojiButtonActive]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </Pressable>
              ))}
            </View>

            {/* Fixed toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>固定費として扱う</Text>
              <Switch
                value={isFixed}
                onValueChange={setIsFixed}
                trackColor={{ true: Colors.primary, false: Colors.borderStrong }}
              />
            </View>

            {/* Save */}
            <Pressable
              style={[styles.saveButton, !name.trim() && styles.saveDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveText}>保存</Text>
            </Pressable>

            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>キャンセル</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
  },
  headerRight: {
    width: 50,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  deletePlaceholder: {
    width: 28,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  fixedBadge: {
    fontSize: 11,
    color: Colors.textTertiary,
    backgroundColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderDisabled: {
    opacity: 0.3,
  },
  reorderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  reorderTextDisabled: {
    color: Colors.textTertiary,
  },
  addButton: {
    backgroundColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modalInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButtonActive: {
    backgroundColor: Colors.secondary,
  },
  emojiText: {
    fontSize: 22,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
