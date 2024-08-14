"use client";

import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import Prism from "prismjs";
import "@/styles/theme.css";

const InputPost = () => {
  const [mode, setMode] = useState("");
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const data = `
  <h1>Welcome to My Blog!</h1>
  
  <h2>Introduction</h2>
  <p>This is a sample paragraph to demonstrate <a href="#" class='no-underline text-sky-600 font-medium dark:text-sky-500'>links</a>, <strong>bold</strong> text, <em>italic</em> text, and <code class='nextra-code' dir='ltr'>inline code</code>. This blog post is designed using Tailwind CSS and supports both light and dark themes.</p>
  
  <h2>Code Block</h2>
  <pre class='language-javascript'><code>const greet = () => { console.log('Hello, World!'); };</code></pre>
  
  <h2>List Example</h2>
  <ul>
    <li>First item in an unordered list.</li>
    <li>Second item in an unordered list.</li>
    <li>Third item with some nested content:
      <ul>
        <li>Nested item 1</li>
        <li>Nested item 2</li>
      </ul>
    </li>
  </ul>
  
  <h2>Blockquote Example</h2>
  <blockquote>"This is an example of a blockquote used to highlight a particular section of the text." - Someone Famous</blockquote>
  
  <h2>Table Example</h2>
  <table style='border-collapse: collapse; width: 100%;' border='1'>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row 1, Cell 1</td>
        <td>Row 1, Cell 2</td>
        <td>Row 1, Cell 3</td>
      </tr>
      <tr>
        <td>Row 2, Cell 1</td>
        <td>Row 2, Cell 2</td>
        <td>Row 2, Cell 3</td>
      </tr>
    </tbody>
  </table>
  
  <h2>Image Example</h2>
  <p>Below is an example of an image:</p>
  <img src="https://thumbs.dreamstime.com/b/peacock-beautiful-coloured-feathers-45482244.jpg" width={600} height={300} alt="Placeholder Image" />
  
  <h2>Horizontal Rule Example</h2>
  <hr>
  
  <h3>Conclusion</h3>
  <p>This sample HTML includes various elements like headings, paragraphs, lists, links, code blocks, tables, images, and more, all of which can be styled using Tailwind CSS. This should give you a comprehensive test for your blog post design.</p>
  `;

  const [postData, setPostData] = useState<string | "">("");
  const log = () => {
    if (editorRef.current) {
      setPostData(editorRef.current.getContent());
    }
  };
  useEffect(() => {
    Prism.highlightAll();
  }, [postData]);
  return (
    <div className="w-full">
      <div className="my-10" dangerouslySetInnerHTML={{ __html: postData }} />
      <Editor
        initialValue={data}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          document.querySelector(".tox-statusbar__help-text")!.innerHTML =
            "Help: Alt or ⌥ + 0 &nbsp;&nbsp;&nbsp;&nbsp; Image: ctrl+c, ctrl+v";
        }}
        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
        onEditorChange={log}
        init={{
          height: 350,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "codesample",
            "insertdatetime",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | outdent indent removeformat" +
            " | hr link image codesample table  | preview help|",
          skin: mode == "dark" ? "oxide-dark" : "oxide",
          content_css: mode == "dark" ? "dark" : "light",
        }}
      />
    </div>
  );
};

export default InputPost;
