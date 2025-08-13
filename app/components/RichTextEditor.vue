<script setup lang="ts">
    import { ref, onBeforeUnmount } from 'vue'
    import { useEditor, EditorContent } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'

    const modelValue = defineModel<string>({ default: '' })

    const editor = useEditor({
    extensions: [
        StarterKit,
    ],
    content: modelValue.value,
    onUpdate: ({ editor }) => {
        modelValue.value = editor.getHTML()
    }
    })

    onBeforeUnmount(() => {
        editor.value?.destroy()
    })
</script>

<template>
  <div class="border rounded-lg p-2">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 mb-2">
    <!-- Bold -->
    <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-200': editor?.isActive('bold') }"
        class="px-2 py-1 border rounded font-bold"
    >
        B
    </button>

    <!-- Italic -->
    <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-200': editor?.isActive('italic') }"
        class="px-2 py-1 border rounded italic"
    >
        I
    </button>

    <!-- Horizontal Rule -->
    <button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        class="px-2 py-1 border rounded"
    >
        ―
    </button>

    <!-- Undo -->
    <button
        @click="editor?.chain().focus().undo().run()"
        class="px-2 py-1 border rounded"
    >
        ⎌
    </button>

    <!-- Redo -->
    <button
        @click="editor?.chain().focus().redo().run()"
        class="px-2 py-1 border rounded"
    >
        ↻
    </button>
    </div>


    <EditorContent :editor="editor" class="min-h-[200px] p-2 focus:outline-none" />
  </div>
</template>

<style>
.ProseMirror {
  outline: none;
}
</style>
