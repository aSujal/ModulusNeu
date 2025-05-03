import React, { MutableRefObject, useLayoutEffect, useRef, useState } from 'react'
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { ImageIcon, Send, Smile, XIcon } from 'lucide-react';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';
import { Button } from './button';
interface EditorValue {
    body: string;
    html: string;
    delta: Delta;
}
interface EditorProps {
    onChange?: (value: EditorValue) => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
}

const RichTextEditor = ({ onChange, placeholder = "Send a message", innerRef, defaultValue = [], disabled = false, variant = "create" }: EditorProps) => {
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null)
    const onChangeRef = useRef(onChange)
    const defaultValueRef = useRef(defaultValue)
    const containerRef = useRef<HTMLDivElement>(null)
    const disabledRef = useRef(disabled)

    useLayoutEffect(() => {
        onChangeRef.current = onChange
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        disabledRef.current = disabled
    })

    React.useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                keyboard: {
                    bindings: {
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                },
                toolbar: [
                    ['bold', 'italic', 'strike', 'underline'], ["link"], [{ "list": "ordered" }, { "list": "bullet" }]
                ]
            }

        }

        const quill = new Quill(editorContainer, options) // new Quill
        quillRef.current = quill;
        quillRef.current.focus();
        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        if (onChangeRef.current) {
            const currentValue = {
                body: quill.getText().trim(),
                html: quill.root.innerHTML,
                delta: quill.getContents()
            };
            onChangeRef.current(currentValue);
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
            const newText = quill.getText();
            if (onChangeRef.current) {
                const currentValue = {
                    body: newText.trim(),
                    html: quill.root.innerHTML,
                    delta: quill.getContents()
                };
                onChangeRef.current(currentValue);
            }
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = '';
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        }
    }, [innerRef])

    return (
        <div className='flex flex-col'>
            <div className={cn('border border-border/50 rounded-md overflow-hidden focus-within:border-border focus-within:shadow-sm transition bg-black/50', disabled && 'opacity-70')}>
                <div className='h-full ql-custom' ref={containerRef} />
            </div>
            {variant === "create" &&
                <div className={cn('p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition', 'opacity-100')}>
                    <p>
                        <strong>Shift + Enter</strong> to add a new line
                    </p>
                </div>
            }
        </div>
    )
}

export default RichTextEditor