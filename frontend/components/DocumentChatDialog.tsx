"use client";

import { useState, useEffect } from "react";

interface DocumentChatDialogProps {
  documentId: string;
}

export function DocumentChatDialog({ documentId }: DocumentChatDialogProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/${documentId}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Nenhuma resposta recebida.");
    } catch (err) {
      setAnswer("Erro ao obter resposta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div>
        <h2>Faça sua pergunta sobre o texto</h2>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder=" Digite sua pergunta..."
          className="chat"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !question}
          className="btn-enviar"
        >
          {loading ? "Consultando..." : "Enviar"}
        </button>

        {answer && (
          <div className="mt-4 p-3 bg-gray-100 border rounded text-sm whitespace-pre-wrap">
            <strong>Resposta:</strong>
            <p className="mt-2">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
