import { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

function CodeEdit(props: {
  editorValue?: string;
  setEditorValue?: (value: string) => void;
  height?: string;
}) {
  const monaco = useMonaco();
  const handleEditorChange = (value: any, event: any) => {
    console.log(value, event);
    props?.setEditorValue?.(value);
    console.log(typeof props?.editorValue);
  };
  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark', // 基于 vs-dark 主题
        inherit: true, // 继承 vs-dark 的设置
        rules: [], // 可以添加或覆盖规则
        colors: {
          'editor.background': '#000000', // 设置编辑器背景色为纯黑
          'editor.foreground': '#ffffff', // 设置前景色（如字体颜色）为白色
        },
      });

      monaco.editor.setTheme('myCustomTheme');
    }
  }, [monaco]);

  return (
    <Editor
      height={props.height || 300}
      value={props.editorValue}
      defaultLanguage='javascript'
      onChange={handleEditorChange}
    />
  );
}
export default CodeEdit;
