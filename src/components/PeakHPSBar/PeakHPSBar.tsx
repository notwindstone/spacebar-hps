export default function PeakHPSBar({
    current,
    peak,
}: {
    current: number;
    peak: number;
}) {
    return (
        <div className="overflow-clip p-[1px] rounded-md w-full h-8 bg-zinc-200">
            <div
                className="rounded-md h-full bg-zinc-900 transition-all"
                style={{
                    width: `${Math.min(100, current / peak * 100)}%`
                }}
            />
        </div>
    );
}