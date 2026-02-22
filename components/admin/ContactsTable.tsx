"use client";

import { useState } from "react";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";

interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export function ContactsTable({ initialContacts }: { initialContacts: Contact[] }) {
    const [contacts, setContacts] = useState(initialContacts);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                お問い合わせ管理
            </h2>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-card/50">
                <table className="w-full text-sm text-left">
                    <thead className="text-muted-foreground border-b border-white/10 bg-white/5">
                        <tr>
                            <th className="py-3 px-4">送信者</th>
                            <th className="py-3 px-4">件名</th>
                            <th className="py-3 px-4">日時</th>
                            <th className="py-3 px-4">ステータス</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-foreground">{contact.name}</div>
                                    <div className="text-xs text-muted-foreground">{contact.email}</div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium">{contact.subject}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{contact.message}</div>
                                </td>
                                <td className="py-4 px-4 text-xs text-muted-foreground">
                                    {new Date(contact.created_at).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${contact.status === 'unread'
                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                        }`}>
                                        {contact.status === 'unread' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                                        {contact.status === 'unread' ? '未読' : '完了'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contacts.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        お問い合わせはありません。
                    </div>
                )}
            </div>
        </div>
    );
}
