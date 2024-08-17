'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core';
import * as Y from 'yjs';
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



    const users = [
        {
            name: 'Coding With Mr.M',
            color: 'yellow'
        },
        {
            name: 'Coding With Mr.M2',
            color: 'Blue'
        },
        {
            name: 'Coding With Mr.M3',
            color: 'red'
        },
    ]

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

    const provider = new YPartyKitProvider(
        "blocknote-dev.yousefed.partykit.dev",
        'notion-like-edior',
        doc,
    )


    const getRandomUser = () => {
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
    };
    const randomUser = getRandomUser();

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
                user: randomUser  // Pass the random user

            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialContent])






    if (editor === undefined) {
        return (
            <main className="flex flex-col h-full animate-pulse">
                <div className="flex-grow p-24 h-64 bg-gray-500 rounded">
                </div>
                <footer className="flex justify-center items-center w-full py-4 h-16 bg-gray-500 rounded">
                </footer>
            </main>
        )
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