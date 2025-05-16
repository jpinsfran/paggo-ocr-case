import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../services/api';
import { DocumentChatDialog } from '../components/DocumentChatDialog';

interface Document {
  id: string;
  filename: string;
  text: string;
  llmOutput: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Buscar documentos do usuário
  const fetchDocuments = async () => {
    setError('');
    try {
      const res = await api.get<Document[]>('/documents');
      setDocuments(res.data);
      if (res.data.length > 0 && !selectedDoc) {
        setSelectedDoc(res.data[0]);
      }
    } catch (err) {
      setError('Erro ao buscar documentos.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload do arquivo
  const handleUpload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post<Document>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDocuments(prev => [res.data, ...prev]);
      setSelectedDoc(res.data);
    } catch (err) {
      setError('Erro no upload do arquivo.');
    } finally {
      setUploading(false);
    }
  };

  // Escolher arquivo para upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    handleUpload(e.target.files[0]);
    e.target.value = '';
  };

  // Download do arquivo txt
  const handleDownload = () => {
    if (!selectedDoc) return;
    const content = `
=== Nome do Arquivo ===
${selectedDoc.filename}

=== Texto Extraído (OCR) ===
${selectedDoc.text}

=== Explicação (LLM) ===
${selectedDoc.llmOutput}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc.filename}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <header className="nav">
          <h3 className="paggo"> Paggo OCR</h3>
          <button className = "btnLogout" onClick={handleLogout} >
            Logout
          </button>
        </header>

        {/* Main layout */}
        <main className ="main-content"style={{ flex: 1, display: 'flex' }}>
          {/* Lista lateral */}
          <aside className='lista'
            style={{
              borderRight: '1px solid #ccc',
              overflowY: 'auto',
              padding: 10,
              boxSizing: 'border-box',
            }}
          >
            <h1 className='documentos'>Documentos</h1>
            {documents.length === 0 && <p>Nenhum documento encontrado.</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {documents.map(doc => (
                <li
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: 10,
                    marginBottom: 8,
                    cursor: 'pointer',
                    backgroundColor: selectedDoc?.id === doc.id ? '#e6f0ff' : 'transparent',
                    borderRadius: 4,
                  }}
                >
                  <strong>{doc.filename}</strong>
                  <br />
                  <small>{new Date(doc.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </aside>

          {/* Conteúdo principal */}
          <section className='abaUpload'>
            <h1>Upload e Visualização</h1>
            <div style={{ marginBottom: 15 }}>
              <button className='btnUpload'
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ padding: '10px 20px', cursor: uploading ? 'not-allowed' : 'pointer' }}
              >
                {uploading ? 'Enviando...' : 'Enviar nova imagem'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!selectedDoc && <p>Selecione um documento para visualizar.</p>}

            {selectedDoc && (
              <>
                <div style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: 15, borderRadius: 6 }}>
                  <h3>{selectedDoc.filename}</h3>
                  <button className = "btnBaixar"onClick={handleDownload} style={{ marginBottom: 10 }}>
                    Baixar texto e explicação (.txt)
                  </button>

                  <h4>Texto extraído (OCR):</h4>
                  <p>{selectedDoc.text || '(vazio)'}</p>

                  <h4>Explicação (LLM):</h4>
                  <p>{selectedDoc.llmOutput || '(vazio)'}</p>
                </div>

                {/* Chat para perguntas */}
                <div style={{ marginTop: 20 }}>
                  <DocumentChatDialog documentId={selectedDoc.id} />
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
