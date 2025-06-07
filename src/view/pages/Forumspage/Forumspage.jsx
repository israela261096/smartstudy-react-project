import { useState } from 'react';
import styles from './Forumspage.module.css';
import { useEffect } from 'react';

function RealForumsPage() {
  const [activeSection, setActiveSection] = useState('all');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    author: ''
  });

  useEffect(() => {
    const initialPosts = [
      {
        id: 1,
        title: "טיפים למבחן במתמטיקה",
        content: "רציתי לשתף כמה טיפים שעזרו לי למבחן במתמטיקה:\n1. תרגלו הרבה דוגמאות\n2. כתבו נוסחאות על דף נפרד\n3. התחילו מהשאלות הקלות",
        category: "tips",
        author: "יוסי כהן",
        date: new Date('2025-06-01'),
        replies: [
          { id: 1, author: "שרה לוי", content: "תודה על הטיפים! באמת עזר לי", date: new Date('2025-06-02') },
          { id: 2, author: "דני מור", content: "יש לך עוד המלצות על ספרים?", date: new Date('2025-06-03') }
        ]
      },
      {
        id: 2,
        title: "מחפש שותף ללמידה לפיזיקה",
        content: "שלום, מחפש מישהו ללמוד יחד פיזיקה לסמסטר הקרוב. אני באזור תל אביב.",
        category: "partners",
        author: "מיכל גרין",
        date: new Date('2025-06-04'),
        replies: [
          { id: 3, author: "רועי אבן", content: "אני מעוניין! אפשר ליצור קשר?", date: new Date('2025-06-05') }
        ]
      },
      {
        id: 3,
        title: "שאלה על קורס מבוא למדעי המחשב",
        content: "מישהו יכול להסביר מה זה Big O notation? לא הבנתי את ההסבר בשיעור.",
        category: "questions",
        author: "עמית שמש",
        date: new Date('2025-06-06'),
        replies: []
      }
    ];
    setPosts(initialPosts);
  }, []);

  const categories = {
    all: "כל הפוסטים",
    tips: "טיפים למבחנים",
    questions: "שאלות כלליות על קורסים",
    partners: "חיפוש שותפים ללמידה",
    support: "בעיות טכניות / תמיכה"
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeSection === 'all' || post.category === activeSection;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e) => {
    if (!newPost.title || !newPost.content || !newPost.category || !newPost.author) {
      alert('נא למלא את כל השדות');
      return;
    }

    const post = {
      id: posts.length + 1,
      ...newPost,
      date: new Date(),
      replies: []
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: '', author: '' });
    setShowCreateForm(false);
    alert('הפוסט נוצר בהצלחה!');
  };

  const handleReply = (postId, replyContent, author) => {
    if (!replyContent.trim() || !author.trim()) {
      alert('נא למלא את כל השדות');
      return;
    }

    const reply = {
      id: Date.now(),
      author,
      content: replyContent,
      date: new Date()
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    ));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-100">פורומים</h1>
        <p className="text-center mb-8 text-gray-300">
          כאן ניתן להתייעץ עם סטודנטים אחרים, לשאול שאלות, לשתף סיכומים או טיפים ללמידה.
        </p>

        {/* כפתורי ניווט */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeSection === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="חיפוש בפורום..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            📝 יצירת פוסט חדש
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">יצירת פוסט חדש</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="שם המחבר"
                value={newPost.author}
                onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="כותרת הפוסט"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
              <textarea
                placeholder="תוכן הפוסט"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                required
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="tips">טיפים למבחנים</option>
                <option value="questions">שאלות כלליות</option>
                <option value="partners">שותפים ללמידה</option>
                <option value="support">תמיכה טכנית</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreatePost}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  שלח פוסט
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              לא נמצאו פוסטים בקטגוריה זו
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onReply={handleReply}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onReply, formatDate }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const categoryEmojis = {
    tips: "💡",
    questions: "❓",
    partners: "🤝",
    support: "🛠️"
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !replyAuthor.trim()) {
      alert('נא למלא את כל השדות');
      return;
    }
    onReply(post.id, replyContent, replyAuthor);
    setReplyContent('');
    setReplyAuthor('');
    setShowReplyForm(false);
    setShowReplies(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-semibold text-blue-100 mb-1">
            {categoryEmojis[post.category]} {post.title}
          </h3>
          <div className="text-sm text-gray-400">
            By {post.author} • {formatDate(post.date)}
          </div>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
          {post.replies.length} תגובות
        </span>
      </div>
      
      <div className="text-gray-200 mb-4 whitespace-pre-line">
        {post.content}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          {showReplies ? 'הסתר תגובות' : `הצג תגובות (${post.replies.length})`}
        </button>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors"
        >
          הגב
        </button>
      </div>

      {/* טופס תגובה */}
      {showReplyForm && (
        <div onSubmit={handleSubmitReply} className="mt-4 p-4 bg-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="השם שלך"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            className="w-full px-3 py-2 mb-2 rounded bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />
          <textarea
            placeholder="כתוב תגובה..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 mb-2 rounded bg-gray-600 text-white border border-gray-500 focus:border-blue-500 focus:outline-none resize-vertical"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmitReply}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              שלח תגובה
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* תגובות */}
      {showReplies && post.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-semibold text-gray-300">תגובות:</h4>
          {post.replies.map(reply => (
            <div key={reply.id} className="bg-gray-700 p-4 rounded-lg border-r-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-blue-200">{reply.author}</span>
                <span className="text-xs text-gray-400">{formatDate(reply.date)}</span>
              </div>
              <div className="text-gray-200 whitespace-pre-line">{reply.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealForumsPage;