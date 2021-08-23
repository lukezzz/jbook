import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import { useRef } from 'react'
import codeShift from 'jscodeshift'
import Highlighter from 'monaco-jsx-highlighter'
import './code-editor.css'
import './syntax.css'


interface CodeEditorProps {
    initialVallue: string
    onChange(value: string): void
}


const CodeEditor: React.FC<CodeEditorProps> = ({ initialVallue, onChange }) => {

    const editorRef = useRef<any>()

    const onEditorDidMount: EditorDidMount = (getValue, MonacoEditor) => {
        editorRef.current = MonacoEditor
        MonacoEditor.onDidChangeModelContent(() => {
            onChange(getValue())
        })
        MonacoEditor.getModel()?.updateOptions({
            tabSize: 2
        })

        const highlighter = new Highlighter(
            // @ts-ignore
            window.monaco,
            codeShift,
            MonacoEditor
        )

        highlighter.highLightOnDidChangeModelContent(
            () => { },
            () => { },
            undefined,
            () => { }
        )
    }

    const onFormatClick = () => {
        // get current value from editor
        // console.log(editorRef.current)
        const unformatted = editorRef.current.getModel().getValue()
        // format value
        const formatted = prettier.format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true
        }).replace(/\n$/, '')
        // set the formatted value back in the editor
        editorRef.current.setValue(formatted)
    }


    return (
        <div className='editor-wrapper'>
            <button
                className="button button-format is-primary is-small"
                onClick={onFormatClick}>Format</button>
            <MonacoEditor
                editorDidMount={onEditorDidMount}
                value={initialVallue}
                height="100%"
                theme="dark"
                language="javascript"
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    )
}

export default CodeEditor