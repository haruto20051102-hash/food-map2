export default function PrivacyPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold tracking-tight mb-8">プライバシーポリシー</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">1. 個人情報の収集</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        当サービスでは、ユーザー登録時やお問い合わせ時に、お名前、メールアドレス等の個人情報をご入力いただく場合がございます。
                        これらの情報は、サービス提供やお問い合わせへの回答のために利用し、それ以外の目的では利用いたしません。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">2. クッキー（Cookie）の使用</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        当サイトでは、ユーザー認証や利便性向上のためにCookieを使用しています。
                        Cookieを無効にすることも可能ですが、その場合サイトの一部機能が正常に動作しない可能性があります。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">3. 位置情報の利用</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        当サービスでは、現在地周辺のスポット検索やチェックイン機能のために位置情報を利用します。
                        取得した位置情報は、上記の目的以外には使用せず、サーバーに保存されることもありません。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">4. 第三者への提供</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        法令に基づく場合を除き、取得した個人情報を本人の同意なく第三者に提供することはありません。
                        ただし、決済処理のために決済代行業者（Stripe等）に必要な情報を提供する場合があります。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">5. お問い合わせ</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりお願いいたします。
                    </p>
                </section>
            </div>
        </div>
    );
}
