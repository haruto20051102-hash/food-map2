export default function TermsPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold tracking-tight mb-8">利用規約</h1>

                <p className="text-muted-foreground mb-8">
                    この利用規約（以下，「本規約」といいます。）は，Hidden Gems（以下，「当方」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第1条（適用）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        本規約は，ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第2条（利用登録）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        本サービスにおいては，登録希望者が本規約に同意の上，当方の定める方法によって利用登録を申請し，当方がこれを承認することによって，利用登録が完了するものとします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第3条（利用料金および支払方法）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        ユーザーは，本サービスの有料部分の対価として，当方が別途定め，本ウェブサイトに表示する利用料金を，当方が指定する方法（Stripe等によるクレジットカード決済）により支払うものとします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第4条（禁止事項）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        ユーザーは，本サービスの利用にあたり，法令または公序良俗に違反する行為、犯罪行為に関連する行為、当方のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為、当方のサービスの運営を妨害するおそれのある行為をしてはならないものとします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第5条（免責事項）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        当方は，本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。当方は，本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第6条（利用規約の変更）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        当方は，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">第7条（準拠法・裁判管轄）</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        本規約の解釈にあたっては，日本法を準拠法とします。本サービスに関して紛争が生じた場合には，当方の本店所在地を管轄する裁判所を専属的合意管轄とします。
                    </p>
                </section>
            </div>
        </div>
    );
}
