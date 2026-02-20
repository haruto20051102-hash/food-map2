export default function LawPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold tracking-tight mb-8">特定商取引法に基づく表記</h1>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-muted-foreground border-collapse">
                        <tbody>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold w-1/3 align-top">販売業者（運営者）</th>
                                <td className="py-4 px-4">Hidden Gems 運営事務局<br />※ユーザー様からの開示請求があった場合、遅滞なく開示いたします。</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">運営責任者</th>
                                <td className="py-4 px-4">亀山遥都</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">所在地</th>
                                <td className="py-4 px-4">※ユーザー様からの開示請求があった場合、遅滞なく開示いたします。</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">連絡先（メールアドレス）</th>
                                <td className="py-4 px-4">サポート窓口が必要な場合はお問い合わせフォームよりご連絡ください。<br />※ユーザー様からの開示請求があった場合、遅滞なく電話番号などを開示いたします。</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">販売価格帯</th>
                                <td className="py-4 px-4">アプリ内の各商品・サービスの購入ページにて表示する価格</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">商品等の引き渡し時期</th>
                                <td className="py-4 px-4">クレジットカード決済完了後、すぐにご利用いただけます。</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">代金の支払方法</th>
                                <td className="py-4 px-4">クレジットカード決済（Stripe）</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">代金の支払時期</th>
                                <td className="py-4 px-4">ご利用のクレジットカードの締め日や契約内容に基づきます。</td>
                            </tr>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-semibold align-top">返品・キャンセルに関する特約</th>
                                <td className="py-4 px-4">提供するサービスの性質上、購入・決済完了後のキャンセルおよび返金はお受け出来ません。</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
