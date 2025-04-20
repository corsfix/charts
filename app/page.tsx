"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Globe, Music, Play, Pause } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  art: string;
  preview: string;
}

const countries = [
  { name: "Worldwide", flag: "🌐", id: 3155776842 },
  { name: "United States", flag: "🇺🇸", id: 1313621735 },
  { name: "Brazil", flag: "🇧🇷", id: 1111141961 },
  { name: "United Kingdom", flag: "🇬🇧", id: 1111142221 },
  { name: "Germany", flag: "🇩🇪", id: 1111143121 },
  { name: "France", flag: "🇫🇷", id: 1109890291 },
  { name: "Colombia", flag: "🇨🇴", id: 1116188451 },
  { name: "Canada", flag: "🇨🇦", id: 1652248171 },
  { name: "Mexico", flag: "🇲🇽", id: 1111142361 },
  { name: "Netherlands", flag: "🇳🇱", id: 1266971851 },
  { name: "South Africa", flag: "🇿🇦", id: 1362528775 },
  { name: "Jamaica", flag: "🇯🇲", id: 1362508575 },
  { name: "Venezuela", flag: "🇻🇪", id: 1362527605 },
  { name: "Ukraine", flag: "🇺🇦", id: 1362526495 },
  { name: "Tunisia", flag: "🇹🇳", id: 1362525375 },
  { name: "Thailand", flag: "🇹🇭", id: 1362524475 },
  { name: "El Salvador", flag: "🇸🇻", id: 1362523615 },
  { name: "Senegal", flag: "🇸🇳", id: 1362523075 },
  { name: "Slovenia", flag: "🇸🇮", id: 1362522355 },
  { name: "Saudi Arabia", flag: "🇸🇦", id: 1362521285 },
  { name: "Paraguay", flag: "🇵🇾", id: 1362520135 },
  { name: "Portugal", flag: "🇵🇹", id: 1362519755 },
  { name: "Philippines", flag: "🇵🇭", id: 1362518895 },
  { name: "Peru", flag: "🇵🇪", id: 1362518525 },
  { name: "Malaysia", flag: "🇲🇾", id: 1362515675 },
  { name: "Morocco", flag: "🇲🇦", id: 1362512715 },
  { name: "Lebanon", flag: "🇱🇧", id: 1362511155 },
  { name: "South Korea", flag: "🇰🇷", id: 1362510315 },
  { name: "Japan", flag: "🇯🇵", id: 1362508955 },
  { name: "Jordan", flag: "🇯🇴", id: 1362508765 },
  { name: "Israel", flag: "🇮🇱", id: 1362507345 },
  { name: "Hungary", flag: "🇭🇺", id: 1362506695 },
  { name: "Egypt", flag: "🇪🇬", id: 1362501615 },
  { name: "Ecuador", flag: "🇪🇨", id: 1362501235 },
  { name: "Algeria", flag: "🇩🇿", id: 1362501015 },
  { name: "Bolivia", flag: "🇧🇴", id: 1362495515 },
  { name: "Bulgaria", flag: "🇧🇬", id: 1362494565 },
  { name: "United Arab Emirates", flag: "🇦🇪", id: 1362491345 },
  { name: "Singapore", flag: "🇸🇬", id: 1313620765 },
  { name: "Sweden", flag: "🇸🇪", id: 1313620305 },
  { name: "Spain", flag: "🇪🇸", id: 1116190041 },
  { name: "Norway", flag: "🇳🇴", id: 1313619885 },
  { name: "Ireland", flag: "🇮🇪", id: 1313619455 },
  { name: "Denmark", flag: "🇩🇰", id: 1313618905 },
  { name: "Costa Rica", flag: "🇨🇷", id: 1313618455 },
  { name: "Switzerland", flag: "🇨🇭", id: 1313617925 },
  { name: "Belgium", flag: "🇧🇪", id: 1266968331 },
  { name: "Australia", flag: "🇦🇺", id: 1313616925 },
  { name: "Turkey", flag: "🇹🇷", id: 1116189071 },
  { name: "Russia", flag: "🇷🇺", id: 1116189381 },
  { name: "Nigeria", flag: "🇳🇬", id: 1362516565 },
  { name: "Austria", flag: "🇦🇹", id: 1313615765 },
  { name: "Argentina", flag: "🇦🇷", id: 1279119721 },
  { name: "Indonesia", flag: "🇮🇩", id: 1116188761 },
  { name: "Italy", flag: "🇮🇹", id: 1116187241 },
  { name: "Chile", flag: "🇨🇱", id: 1279119121 },
  { name: "Guatemala", flag: "🇬🇹", id: 1279118671 },
  { name: "Romania", flag: "🇷🇴", id: 1279117071 },
  { name: "Slovakia", flag: "🇸🇰", id: 1266973701 },
  { name: "Serbia", flag: "🇷🇸", id: 1266972981 },
  { name: "Kenya", flag: "🇰🇪", id: 1362509215 },
  { name: "Poland", flag: "🇵🇱", id: 1266972311 },
  { name: "Croatia", flag: "🇭🇷", id: 1266971131 },
  { name: "Czech Republic", flag: "🇨🇿", id: 1266969571 },
  { name: "Latvia", flag: "🇱🇻", id: 1221037511 },
  { name: "Lithuania", flag: "🇱🇹", id: 1221037371 },
  { name: "Estonia", flag: "🇪🇪", id: 1221037201 },
  { name: "Finland", flag: "🇫🇮", id: 1221034071 },
  { name: "Honduras", flag: "🇭🇳", id: 1116190301 },
  { name: "Ivory Coast", flag: "🇨🇮", id: 1362497945 },
];

export default function Page() {
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedCountryData = countries.find(
    (country) => country.name === selectedCountry
  );

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedCountryData) return;

      setIsLoading(true);
      setError(null);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setPlayingPreviewUrl(null);
      }

      const fetchUrl = `https://proxy.corsfix.com/?https://api.deezer.com/playlist/${selectedCountryData.id}`;

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
              errorMsg = `Error: ${errorData.error.message} (Code: ${errorData.error.code})`;

              if (errorData.error.code === 4 || errorData.error.code === 800) {
                errorMsg +=
                  " - Deezer API rate limit likely exceeded. Please try again later.";
              }
            }
          } catch (e) {
            console.error(e);
          }
          throw new Error(errorMsg);
        }
        const data = await response.json();

        if (data.error) {
          throw new Error(
            `Deezer API Error: ${data.error.message} (Code: ${data.error.code})`
          );
        }

        if (!data.tracks || !data.tracks.data) {
          console.warn("Unexpected API response structure:", data);
          throw new Error("Failed to parse track data from API response.");
        }

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const mappedSongs: Song[] = data.tracks.data.map((track: any) => ({
          id: track.id,
          title: track.title_short || track.title,
          artist: track.artist.name,
          album: track.album.title,
          duration: formatDuration(track.duration),
          art: track.album.cover_medium,
          preview: track.preview,
        }));
        setSongs(mappedSongs);
      } catch (err: any) {
        console.error("Failed to fetch chart data:", err);
        setError(err.message || "Failed to fetch data. Please try again.");
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedCountryData]);

  const handlePlayPause = (previewUrl: string) => {
    if (!previewUrl) return;

    if (audioRef.current && playingPreviewUrl === previewUrl) {
      audioRef.current.pause();
      setPlayingPreviewUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(previewUrl);
      audioRef.current
        .play()
        .catch((e) => console.error("Audio play failed:", e));
      setPlayingPreviewUrl(previewUrl);

      audioRef.current.onended = () => {
        setPlayingPreviewUrl(null);
        audioRef.current = null;
      };

      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setError("Audio playback failed.");
        setPlayingPreviewUrl(null);
        audioRef.current = null;
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ... Header ... */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl mr-3">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Charts
            </h1>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-8 max-w-6xl w-full mx-auto">
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold mb-4 sm:mb-0">
                  Top Charts{" "}
                  {selectedCountryData &&
                    `- ${selectedCountryData.flag} ${selectedCountryData.name}`}
                </h2>

                {/* Country Selector Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                  {/* ... PopoverTrigger ... */}
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="flex items-center gap-2 rounded-full border-gray-200 dark:border-gray-700 px-4 py-2 w-[200px] justify-between"
                    >
                      {selectedCountryData ? (
                        <>
                          <span className="mr-1">
                            {selectedCountryData.flag}
                          </span>
                          {selectedCountryData.name}
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4" />
                          Select Country
                        </>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 max-h-[400px] overflow-y-auto">
                    {" "}
                    {/* Added max-height and overflow */}
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((country) => (
                              <CommandItem
                                key={country.id}
                                value={country.name}
                                onSelect={() => {
                                  setSelectedCountry(country.name);
                                  setOpen(false);
                                }}
                              >
                                <span className="mr-2">{country.flag}</span>
                                {country.name}
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    selectedCountry === country.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Song List Area */}
              {isLoading ? (
                <div className="text-center py-10">Loading chart data...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-600 dark:text-red-400">
                  Error: {error}
                </div>
              ) : songs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No songs found for this chart.
                </div>
              ) : (
                <div className="space-y-1">
                  {" "}
                  {/* Reduced space */}
                  {/* Header Row */}
                  <div className="grid grid-cols-12 text-xs uppercase text-muted-foreground font-medium px-4 py-2 border-b dark:border-gray-700">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-4 hidden md:block">Album</div>
                    <div className="col-span-2 text-right hidden sm:block">
                      Duration
                    </div>
                  </div>
                  {/* Song Rows */}
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="grid grid-cols-12 items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 group transition-colors cursor-default"
                    >
                      <div className="col-span-1 flex items-center">
                        <span className="font-medium text-muted-foreground w-6 text-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                          {/* Use actual album art */}
                          <Image
                            src={song.art || "/placeholder.svg?text=?"}
                            alt={song.album}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized={song.art?.includes(
                              "e-cdns-images.dzcdn.net"
                            )}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?text=?";
                            }}
                          />
                          {/* Play/Pause Button Overlay */}
                          {song.preview && (
                            <button
                              onClick={() => handlePlayPause(song.preview)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer focus:outline-none"
                              aria-label={
                                playingPreviewUrl === song.preview
                                  ? "Pause preview"
                                  : "Play preview"
                              }
                            >
                              {playingPreviewUrl === song.preview ? (
                                <Pause className="w-5 h-5 text-white" />
                              ) : (
                                <Play className="w-5 h-5 text-white" />
                              )}
                            </button>
                          )}
                        </div>
                        <div>
                          <div className="font-medium line-clamp-1">
                            {song.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {song.artist}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-4 text-sm text-muted-foreground truncate hidden md:block">
                        {song.album}
                      </div>
                      <div className="col-span-2 text-sm text-right hidden sm:block">
                        {song.duration}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <footer className="text-center text-sm pb-8">
        <p>
          Charts is powered by Corsfix{" "}
          <a href="https://corsfix.com" target="_blank" className="underline">
            CORS proxy
          </a>
          <span className="mx-2">&bull;</span>
          <a
            href="https://github.com/corsfix/charts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Source code
          </a>
        </p>
        <p>
          Deezer API is owned by Deezer and is not affiliated with this website.
        </p>
      </footer>
    </div>
  );
}
