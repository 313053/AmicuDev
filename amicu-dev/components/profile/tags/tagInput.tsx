import { Input } from "../../ui/input";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface TagAutocompleteInputProps {
    value: string;
    onChange: (value : string) => void;
    disabled?: boolean;
    placeholder?: string;
    errorState?: boolean;
}

export function TagInput({ value, onChange, disabled = false, placeholder = "Enter a skill...", errorState = false }: TagAutocompleteInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const fetchSuggestions = (query: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!query || query.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceTimerRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/tag/search-tags?q=${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch tag suggestions');
                }
                
                const data : {name: string}[] = await response.json();
                const filteredData = Array.from(new Set(data?.map(tag => tag.name) || [])) // Eliminates repeats faster than filter()
                setSuggestions(filteredData);
            } catch (error) {
                console.error('Error fetching tag suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        fetchSuggestions(newValue);
        onChange(newValue);
    };

    const handleClickSuggestion = (selected: string) => {
        setInputValue(selected);
        onChange(selected);
        setOpen(false);
    };

    const renderSuggestions = () => {
        if (suggestions.length === 0) {
            return <div className="py-6 text-center text-sm">No tags found</div>;
        }

        return (
            <div className="max-h-72 overflow-y-visible">
                {suggestions.map((name) => (
                    <div
                        key={name}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        onClick={() => handleClickSuggestion(name)}
                    >
                        {name}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full overflow-visible">
            <Input
                ref={inputRef}
                disabled={disabled}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`w-full bg-card disabled:bg-background shadow-lg ${errorState && "border-red-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"}`}
                onFocus={() => !disabled && setOpen(true)}
            />
            {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            )}

            {open && !disabled && (
                <div className="absolute top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95 overflow-visible">
                    {renderSuggestions()}
                </div>
            )}
        </div>
    );
}