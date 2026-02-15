import { MapPin, Target, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Hidden Gemsについて</h1>
                    <p className="text-xl text-muted-foreground">
                        茨城の隠れた名店を発見し、共有するコミュニティ
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">ミッション</h3>
                        <p className="text-sm text-muted-foreground">
                            ガイドブックには載っていない、地元の人だけが知る特別な場所を見つけ出し、その魅力を伝えます。
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">地域密着</h3>
                        <p className="text-sm text-muted-foreground">
                            茨城県に特化し、地域の活性化と新しい食の体験を提供することを目指しています。
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">コミュニティ</h3>
                        <p className="text-sm text-muted-foreground">
                            実際に行った人の信頼できる口コミを通じて、質の高い情報を共有し合うプラットフォームです。
                        </p>
                    </div>
                </div>

                <div className="bg-muted p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4">運営: Hidden Gemsプロジェクト</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                        <div className="border-b border-border pb-2">
                            <dt className="text-sm font-medium text-muted-foreground">サービス名</dt>
                            <dd className="text-base font-medium">Hidden Gems</dd>
                        </div>
                        <div className="border-b border-border pb-2">
                            <dt className="text-sm font-medium text-muted-foreground">所在地</dt>
                            <dd className="text-base font-medium">茨城県内</dd>
                        </div>
                        <div className="border-b border-border pb-2">
                            <dt className="text-sm font-medium text-muted-foreground">設立</dt>
                            <dd className="text-base font-medium">2026年</dd>
                        </div>
                        <div className="border-b border-border pb-2">
                            <dt className="text-sm font-medium text-muted-foreground">事業内容</dt>
                            <dd className="text-base font-medium">飲食店検索サービスの企画・開発・運営</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
