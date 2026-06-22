import { prisma } from "@/lib/db";
import ReactMarkdown from "react-markdown";

export default async function AboutPage() {
  const user = await prisma.user.findFirst({
    select: { nickname: true, avatar: true, bio: true, socialLinks: true },
  });

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        博主还没填写个人信息
      </div>
    );
  }

  const socialLinks = user.socialLinks ? JSON.parse(user.socialLinks) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-24 h-24 rounded-full mx-auto mb-5 object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-5 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ring-2 ring-gray-200">
            <span className="text-3xl font-bold text-gray-400">
              {user.nickname.charAt(0)}
            </span>
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{user.nickname}</h1>
        {socialLinks && (
          <div className="flex items-center justify-center gap-4 text-sm">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                邮箱
              </a>
            )}
          </div>
        )}
      </div>

      {user.bio && (
        <div className="prose prose-gray max-w-none">
          <ReactMarkdown>{user.bio}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
