"use client";

import React, { useCallback, useMemo, useState } from "react";
import Tiptap from "./Tiptap";
import { ContentBlock } from "@/app/Ults";
import ButtonIconComponent from "../ButtonIconComponent";
import { motion, AnimatePresence } from "framer-motion";

type MultiBlockEditorProps = {
    blocks: ContentBlock[];
    onBlocksChange: (blocks: ContentBlock[]) => void;
    isBorder: boolean;
    projectTitle?: string; // Project title for organizing images in S3
};

/**
 * Extract image URLs from HTML content
 */
const extractImageUrls = (htmlContent: string): string[] => {
    console.log(`\n🔎 [MultiBlockEditor.extractImageUrls] Extracting URLs from HTML (length: ${htmlContent.length})`);
    const imageUrls: string[] = [];
    try {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const images = div.querySelectorAll('img');
        console.log(`   Found ${images.length} <img> elements`);

        images.forEach((img, idx) => {
            const src = img.getAttribute('src');
            if (src && (src.startsWith('http') || src.startsWith('https'))) {
                imageUrls.push(src);
                console.log(`   [${idx}] Image URL: ${src.substring(0, 60)}...`);
            }
        });
        console.log(`✅ [MultiBlockEditor.extractImageUrls] Total URLs extracted: ${imageUrls.length}`);
    } catch (error) {
        console.error('❌ [MultiBlockEditor.extractImageUrls] Error extracting image URLs:', error);
    }
    return imageUrls;
};

/**
 * Delete images from S3 when block is deleted
 */
const deleteBlockImages = async (blockContent: string) => {
    console.log(`\n🗑️ [MultiBlockEditor.deleteBlockImages] Starting deletion process`);
    const imageUrls = extractImageUrls(blockContent);

    if (imageUrls.length === 0) {
        console.log(`ℹ️ [MultiBlockEditor.deleteBlockImages] No images to delete`);
        return;
    }

    try {
        console.log(`🗑️ [MultiBlockEditor.deleteBlockImages] Deleting ${imageUrls.length} images from S3...`);
        console.log(`   Image URLs:`, imageUrls.map(url => url.substring(0, 60) + '...'));

        const deleteStartTime = Date.now();
        const response = await fetch('/api/persional_project/delete-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls }),
        });
        const deleteDuration = Date.now() - deleteStartTime;

        console.log(`📊 [MultiBlockEditor.deleteBlockImages] Response received (${deleteDuration}ms):`, {
            status: response.status,
            ok: response.ok,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`❌ [MultiBlockEditor.deleteBlockImages] Server error:`, error);
            return;
        }

        const data = await response.json();
        console.log(`✅ [MultiBlockEditor.deleteBlockImages] Deleted ${data.deletedCount} images from S3`);
    } catch (error) {
        console.error('❌ [MultiBlockEditor.deleteBlockImages] Error deleting block images:', error);
    }
};

const MultiBlockEditor = ({
    blocks,
    onBlocksChange,
    isBorder,
    projectTitle,
}: MultiBlockEditorProps) => {
    const [focusedBlockIndex, setFocusedBlockIndex] = useState<number | null>(null);

    // Debug isBorder and projectTitle on every render
    console.log(`\n📋 [MultiBlockEditor] Component rendered:`, {
        isBorder,
        blockCount: blocks.length,
        projectTitle: projectTitle || "EMPTY",
        projectTitleTrimmed: projectTitle?.trim() || "EMPTY",
        projectTitleType: typeof projectTitle,
        projectTitleExists: !!projectTitle,
        projectTitleLength: projectTitle?.length || 0,
        focusedBlockIndex,
    });

    // Critical warning if projectTitle is missing
    if (!projectTitle || projectTitle.trim() === '') {
        console.warn(`⚠️ [MultiBlockEditor] WARNING: projectTitle is not provided or empty!`);
        console.warn(`   This will cause images in blocks to be saved without project folder organization`);
        console.warn(`   Expected: projectTitle should be passed from parent (DetailProject page)`);
    }
    // Add new block after current index
    const addBlockAfter = useCallback(
        (index: number) => {
            console.log(`\n➕ [MultiBlockEditor.addBlockAfter] Adding block after index ${index}`);
            console.log(`   Current blocks:`, blocks.map(b => ({ index: b.index, type: b.type })));

            // First increment all blocks with index > current index
            const updatedBlocks = blocks.map((block) =>
                block.index > index ? { ...block, index: block.index + 1 } : block
            );

            // Then create new block with updated index to avoid duplicates
            const newBlock: ContentBlock = {
                index: index + 1,
                type: "text",
                content: "",
            };

            updatedBlocks.push(newBlock);
            updatedBlocks.sort((a, b) => a.index - b.index);
            onBlocksChange(updatedBlocks);
            console.log(`✅ [MultiBlockEditor.addBlockAfter] Successfully added new block at index ${index + 1}`);
        },
        [blocks, onBlocksChange]
    );

    // Delete block and its images from S3
    const deleteBlockWithImages = useCallback(
        async (index: number) => {
            console.log(`\n🗑️ [MultiBlockEditor.deleteBlockWithImages] Deleting block at index ${index}`);
            if (blocks.length === 1) {
                console.warn(`⚠️ [MultiBlockEditor.deleteBlockWithImages] Cannot delete last block`);
                return; // Prevent deleting the last block
            }

            // Find the block to delete
            const blockToDelete = blocks.find((b) => b.index === index);
            console.log(`   Block to delete:`, {
                found: !!blockToDelete,
                index: blockToDelete?.index,
                hasContent: !!blockToDelete?.content,
                contentLength: blockToDelete?.content?.length || 0,
            });

            // Delete images from S3 if content contains any
            if (blockToDelete && blockToDelete.content) {
                try {
                    const imageUrls = extractImageUrls(blockToDelete.content);
                    if (imageUrls.length > 0) {
                        console.log(`   ${imageUrls.length} images found in block - deleting from S3...`);
                        await deleteBlockImages(blockToDelete.content);
                    } else {
                        console.log(`   No images found in block`);
                    }
                } catch (error) {
                    console.error('❌ [MultiBlockEditor.deleteBlockWithImages] Failed to delete images:', error);
                }
            }

            // Update blocks
            console.log(`   Updating blocks array...`);
            const updatedBlocks = blocks
                .filter((b) => b.index !== index)
                .map((block) =>
                    block.index > index ? { ...block, index: block.index - 1 } : block
                );

            console.log(`   Updated blocks:`, updatedBlocks.map(b => ({ index: b.index, type: b.type })));
            onBlocksChange(updatedBlocks);
            console.log(`✅ [MultiBlockEditor.deleteBlockWithImages] Block deleted successfully`);
        },
        [blocks, onBlocksChange]
    );

    const deleteBlock = useCallback(
        (index: number) => {
            deleteBlockWithImages(index);
        },
        [deleteBlockWithImages]
    );

    // Move block up
    const moveBlockUp = useCallback(
        (index: number) => {
            if (index === 0) return;

            const updatedBlocks = blocks.map((block) => {
                if (block.index === index) return { ...block, index: index - 1 };
                if (block.index === index - 1) return { ...block, index };
                return block;
            });

            onBlocksChange(updatedBlocks);
        },
        [blocks, onBlocksChange]
    );

    // Move block down
    const moveBlockDown = useCallback(
        (index: number) => {
            if (index === blocks.length - 1) return;

            const updatedBlocks = blocks.map((block) => {
                if (block.index === index) return { ...block, index: index + 1 };
                if (block.index === index + 1) return { ...block, index };
                return block;
            });

            onBlocksChange(updatedBlocks);
        },
        [blocks, onBlocksChange]
    );

    // Update specific block content
    const updateBlockContent = useCallback(
        async (index: number, content: string) => {
            console.log(`\n${"═".repeat(70)}`);
            console.log(`📝 [MultiBlockEditor.updateBlockContent] BLOCK CONTENT UPDATE`);
            console.log(`${"═".repeat(70)}`);
            console.log(`   Block Index: ${index}`);
            console.log(`   Timestamp: ${new Date().toISOString()}`);

            // Find old content
            const oldBlock = blocks.find(b => b.index === index);
            const oldContent = oldBlock?.content || '';

            // Extract image URLs from old and new content
            const oldImageUrls = extractImageUrls(oldContent);
            const newImageUrls = extractImageUrls(content);

            // Count images in old vs new content
            const oldImageCount = oldImageUrls.length;
            const newImageCount = newImageUrls.length;

            console.log(`   Old content:`, {
                length: oldContent.length,
                isEmpty: oldContent === '<p></p>' || oldContent === '',
                hasImages: oldContent.includes('<img'),
                imageCount: oldImageCount,
                preview: oldContent.substring(0, 100),
            });

            console.log(`   New content:`, {
                length: content.length,
                isEmpty: content === '<p></p>' || content === '',
                hasImages: content.includes('<img'),
                imageCount: newImageCount,
                preview: content.substring(0, 100),
            });

            // Detect changes
            const contentChanged = oldContent !== content;
            const imagesAdded = oldImageCount === 0 && newImageCount > 0;
            const imagesRemoved = oldImageCount > 0 && newImageCount === 0;
            const imageCountChanged = oldImageCount !== newImageCount;

            // Find deleted images - URLs that exist in old but not in new
            const deletedImageUrls = oldImageUrls.filter(url => !newImageUrls.includes(url));
            const hasDeletedImages = deletedImageUrls.length > 0;

            console.log(`   Changes detected:`, {
                contentChanged,
                imagesAdded,
                imagesRemoved,
                imageCountChanged,
                oldImageCount,
                newImageCount,
                hasDeletedImages,
                deletedImageCount: deletedImageUrls.length,
            });

            // Log deleted image URLs
            if (hasDeletedImages) {
                console.log(`   🗑️ [DELETED IMAGES DETECTED] ${deletedImageUrls.length} image(s) were removed:`,
                    deletedImageUrls.map(url => url.substring(0, 80) + '...')
                );
            }

            // Log image URLs if present in new content
            if (content.includes('<img')) {
                if (newImageUrls.length > 0) {
                    console.log(`   📸 Image URLs in new content (${newImageUrls.length} total):`, newImageUrls.map(url => {
                        try {
                            return url.substring(0, 80) + '...';
                        } catch {
                            return url;
                        }
                    }));
                    if (imagesAdded) {
                        console.log(`   🎉 [NEW IMAGES DETECTED] Images were successfully added to block!`);
                        console.log(`   🔄 Will now save these ${newImageUrls.length} URL(s) to block ${index}`);
                    }
                }
            }

            // Delete images from S3 if any were removed
            if (hasDeletedImages) {
                try {
                    console.log(`   �️ [MultiBlockEditor.updateBlockContent] Deleting ${deletedImageUrls.length} removed images from S3...`);

                    const deleteStartTime = Date.now();
                    const deleteResponse = await fetch('/api/persional_project/delete-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageUrls: deletedImageUrls }),
                    });
                    const deleteDuration = Date.now() - deleteStartTime;

                    console.log(`   📊 [MultiBlockEditor.updateBlockContent] Delete response received (${deleteDuration}ms):`, {
                        status: deleteResponse.status,
                        ok: deleteResponse.ok,
                    });

                    if (deleteResponse.ok) {
                        const deleteData = await deleteResponse.json();
                        console.log(`   ✅ [MultiBlockEditor.updateBlockContent] Successfully deleted ${deleteData.deletedCount || deletedImageUrls.length} images from S3`);
                    } else {
                        console.error(`   ❌ [MultiBlockEditor.updateBlockContent] Failed to delete images from S3 - HTTP ${deleteResponse.status}`);
                    }
                } catch (error) {
                    console.error(`   ❌ [MultiBlockEditor.updateBlockContent] Error deleting images:`, error);
                }
            }

            // Update blocks
            const updatedBlocks = blocks.map((block) =>
                block.index === index ? { ...block, content } : block
            );

            console.log(`   Updated blocks summary:`);
            updatedBlocks.forEach((block, idx) => {
                const hasImg = block.content.includes('<img');
                const imgCount = (block.content.match(/<img/g) || []).length;
                console.log(`      [${idx}] Index ${block.index}: ${block.content.length} chars${hasImg ? ` (${imgCount} images)` : ''}`);
            });

            console.log(`${"═".repeat(70)}\n`);

            onBlocksChange(updatedBlocks);
        },
        [blocks, onBlocksChange]
    );

    // Sort blocks by index for rendering
    const sortedBlocks = useMemo(() => {
        return [...blocks].sort((a, b) => a.index - b.index);
    }, [blocks]);

    return (
        <div className="flex flex-col gap-4">
            <AnimatePresence>
                {sortedBlocks.map((block, position) => (
                    <motion.div
                        key={`${block.index}-${block.type}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2 items-start"
                    >
                        {/* Move buttons on the left - only show when focused */}
                        {isBorder && focusedBlockIndex === block.index && (
                            <div className="flex flex-col gap-1 mt-2">
                                <button
                                    onClick={() => moveBlockUp(block.index)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    disabled={position === 0}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Move up"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 15a.75.75 0 0 0 .75-.75V2.707l3.22 3.22a.75.75 0 1 0 1.06-1.06l-4.5-4.5a.75.75 0 0 0-1.06 0l-4.5 4.5a.75.75 0 0 0 1.06 1.06l3.22-3.22V14.25A.75.75 0 0 0 8 15Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveBlockDown(block.index)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    disabled={position === sortedBlocks.length - 1}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Move down"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 1a.75.75 0 0 1 .75.75v10.543l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V1.75A.75.75 0 0 1 8 1Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Block content editor */}
                        <div className="flex-1">
                            <div className={`rounded-lg overflow-hidden ${isBorder && focusedBlockIndex === block.index ? "border-2 border-blue-500" : ""
                                }`}>
                                <Tiptap
                                    content={block.content}
                                    onChangeContent={(content) =>
                                        updateBlockContent(block.index, content)
                                    }
                                    isBorder={isBorder}
                                    isActive={isBorder && focusedBlockIndex === block.index}
                                    onFocus={() => isBorder && setFocusedBlockIndex(block.index)}
                                    onBlur={() => { setTimeout(() => setFocusedBlockIndex(null), 100); }}
                                    projectTitle={projectTitle}
                                />
                            </div>
                        </div>

                        {/* Delete and Add buttons - only show when focused */}
                        {isBorder && focusedBlockIndex === block.index && (
                            <div className="flex flex-col gap-1">
                                <ButtonIconComponent
                                    title="Add block"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="size-4"
                                        >
                                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                        </svg>
                                    }
                                    onClick={() => addBlockAfter(block.index)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                />
                                <ButtonIconComponent
                                    title="Delete"
                                    icon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="size-4"
                                        >
                                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                                        </svg>
                                    }
                                    onClick={() => deleteBlock(block.index)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Button to add first block if empty */}
            {blocks.length === 0 && (
                <button
                    onClick={() => addBlockAfter(-1)}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="w-full py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                    + Add first block
                </button>
            )}
        </div>
    );
};

export default MultiBlockEditor;
