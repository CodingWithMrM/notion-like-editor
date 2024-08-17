'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc'
import YPartyKitProvider from "y-partykit/provider";


const saveToLocalStorage = async (jsonBlocks: Block[]) => {
    localStorage.setItem('editorBlock', JSON.stringify(jsonBlocks))
}

const getDataFromLocalStorage = async () => {
    const getStorageData = localStorage.getItem('editorBlock');
    return getStorageData ? (JSON.parse(getStorageData)) as PartialBlock[] : undefined
};

const EditorComponent = () => {
    const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | 'loading'>('loading')

    useEffect(() => {
        getDataFromLocalStorage().then((content) => {
            setInitialContent(content)
        })
    }, []);



    const uploadFile = async (file: File) => {
        const body = new FormData();
        body.append('file', file);

        const res = await fetch('https://tmpfiles.org/api/v1/upload',
            {

                method: 'POST',
                body
            });
        return (await res.json()).data.url.replace(
            'tmpfiles.org/',
            'tmpfiles.org/dl/'
        );
    }

    const doc = new Y.Doc();
    // const provider = new WebrtcProvider('coding-with-mr.m-doc', doc);

    const provider = new YPartyKitProvider(
        'coding-with-mr.m-doc',
        'notion-like-edior',
        doc,
    )


    const editor = useMemo(() => {
        if (initialContent === 'loading') {
            return undefined
        }

        return BlockNoteEditor.create({
            initialContent,
            uploadFile,
            collaboration: {
                provider,
                fragment: doc.getXmlFragment('coding-with-mr-docs'),
                user: {
                    name: 'Codign With Mr.M',
                    color: 'red'
                }
            }
        })
    }, [initialContent])






    if (editor === undefined) {
        return 'loading content'
    }


    return (
        <div className=''>
            <BlockNoteView editor={editor}
                onChange={() => saveToLocalStorage(editor?.document)}
            />
        </div>
    )
}

export default EditorComponent