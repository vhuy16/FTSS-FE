export default function Avatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
    let initials = '';
    if (name) {
        initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }
    return (
        <div className="w-full h-full min-w-10 min-h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
                initials
            )}
        </div>
    );
}
