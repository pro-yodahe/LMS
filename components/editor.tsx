"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
};

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-2">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Start writing..."
      />
    </div>
  );
};
