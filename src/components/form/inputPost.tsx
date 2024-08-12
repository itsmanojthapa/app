"use client";

import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

const InputPost = () => {
  const [mode, setMode] = useState("");
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [postData, setPostData] = useState("");
  const log = () => {
    if (editorRef.current) {
      setPostData(editorRef.current.getContent());
    }
  };
  useEffect(() => {
    document.querySelector("#me")!.innerHTML = postData;
  }, [postData]);

  return (
    <div className="w-full">
      <Editor
        initialValue="Welcome to TinyMCE!"
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
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | outdent indent removeformat" +
            " | hr link image codesample table | preview help|",
          skin: mode == "dark" ? "oxide-dark" : "oxide",
          content_css: mode == "dark" ? "dark" : "light",
        }}
      />
      <div className="mt-10" id="me"></div>
    </div>
  );
};

export default InputPost;
