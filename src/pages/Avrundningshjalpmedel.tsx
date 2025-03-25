import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Avrundningshjalpmedel = () => {
    const [tal, setTal] = useState<string>('0');
    const [avrundningstyp, setAvrundningstyp] = useState<string>('Heltal');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [elevSvar, setElevSvar] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [antalFel, setAntalFel] = useState<number>(0);
    const [spellaege, setSpellaege] = useState<boolean>(false);
    const [spelTal, setSpelTal] = useState<string>('');
    const [isAdjustOpen, setIsAdjustOpen] = useState<boolean>(true);

    useEffect(() => {
        const visaTallinje = () => {
            try {
                const talNummer = spellaege ? parseFloat(spelTal) : parseFloat(tal);
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                let minVarde: number;
                let maxVarde: number;
                let tickSpacing: number;
                let tickFormat: (val: number) => string;
                let litenTickSpacing: number;

                if (avrundningstyp === "Heltal") {
                    minVarde = Math.floor(talNummer) - 2;
                    maxVarde = Math.ceil(talNummer) + 2;
                    tickSpacing = 1;
                    tickFormat = (val) => val.toString();
                    litenTickSpacing = 0.1;
                } else if (avrundningstyp === "Tiondelar") {
                    minVarde = Math.floor(talNummer * 10) / 10 - 1;
                    maxVarde = Math.ceil(talNummer * 10) / 10 + 1;
                    tickSpacing = 0.1;
                    tickFormat = (val) => val.toFixed(1);
                    litenTickSpacing = 0.01;
                } else {
                    minVarde = Math.floor(talNummer * 100) / 100 - 0.1;
                    maxVarde = Math.ceil(talNummer * 100) / 100 + 0.1;
                    tickSpacing = 0.01;
                    tickFormat = (val) => val.toFixed(2);
                    litenTickSpacing = 0.001;
                }

                canvas.width = canvas.parentElement?.offsetWidth || 800;
                canvas.height = 150;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.stroke();

                const totalSpan = maxVarde - minVarde;
                const canvasWidth = canvas.width;
                const canvasTickSpacing = canvasWidth / totalSpan * tickSpacing;

                for (let i = minVarde; i <= maxVarde; i += tickSpacing) {
                    const x = (i - minVarde) * (canvasWidth / totalSpan);
                    ctx.beginPath();
                    ctx.moveTo(x, canvas.height / 2 - 10);
                    ctx.lineTo(x, canvas.height / 2 + 10);
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                    ctx.font = '12px SF Pro Display, system-ui, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(tickFormat(i), x, canvas.height / 2 + 25);
                }

                const canvasLitenTickSpacing = canvasWidth / totalSpan * litenTickSpacing;
                for (let i = minVarde; i <= maxVarde; i += litenTickSpacing) {
                    const x = (i - minVarde) * (canvasWidth / totalSpan);
                    ctx.beginPath();
                    ctx.moveTo(x, canvas.height / 2 - 5);
                    ctx.lineTo(x, canvas.height / 2 + 5);
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.stroke();
                }

                const talX = (talNummer - minVarde) * (canvasWidth / totalSpan);
                ctx.beginPath();
                ctx.arc(talX, canvas.height / 2, 6, 0, 2 * Math.PI);
                ctx.fillStyle = '#0070f3';
                ctx.fill();
                ctx.font = 'bold 14px SF Pro Display, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#0070f3';
                ctx.fillText(talNummer.toString(), talX, canvas.height / 2 - 20);

            } catch (error) {
                console.error("Error in visaTallinje:", error);
            }
        };

        visaTallinje();
    }, [tal, avrundningstyp, spellaege, spelTal]);

    const hanteraSvar = () => {
        const talNummer = spellaege ? parseFloat(spelTal) : parseFloat(tal);
        const elevSvarNummer = parseFloat(elevSvar);
        let korrektSvar: number;

        if (avrundningstyp === "Heltal") {
            korrektSvar = Math.round(talNummer);
        } else if (avrundningstyp === "Tiondelar") {
            korrektSvar = Math.round(talNummer * 10) / 10;
        } else {
            korrektSvar = Math.round(talNummer * 100) / 100;
        }

        if (elevSvarNummer === korrektSvar) {
            setFeedback(`Rätt svar! ${talNummer} avrundat till ${avrundningstyp.toLowerCase()} är ${korrektSvar}.`);
            setAntalFel(0);
            setElevSvar('');
            if (spellaege) {
                generateRandomNumber();
            }
        } else {
            setAntalFel(prevAntalFel => prevAntalFel + 1);
            if (antalFel >= 2) {
                setFeedback(`Fel svar. Rätt svar är ${korrektSvar}.`);
                setAntalFel(0);
                setElevSvar('');
            } else {
                setFeedback('Fel svar. Försök igen!');
                setElevSvar('');
            }
        }
    };

    const generateRandomNumber = () => {
        if (avrundningstyp === "Hundradelar") {
            const randomNum = (Math.random() * 10).toFixed(3);
            setSpelTal(randomNum);
        } else {
            setSpelTal((Math.random() * 10).toFixed(2));
        }
    };

    useEffect(() => {
        if (spellaege) {
            generateRandomNumber();
        }
    }, [avrundningstyp, spellaege]);

    const startaSpel = () => {
        if (!spellaege) {
            setSpellaege(true);
            generateRandomNumber();
            setFeedback('');
            setElevSvar('');
            setAntalFel(0);
        } else {
            setSpellaege(false);
            setFeedback('');
            setElevSvar('');
            setAntalFel(0);
        }
    };

    const ökaVärde = () => {
        if (spellaege) {
            const steg = avrundningstyp === "Heltal" ? 1 : avrundningstyp === "Tiondelar" ? 0.1 : 0.01;
            const nyaSpelTal = (parseFloat(spelTal) + steg).toFixed(avrundningstyp === "Heltal" ? 0 : avrundningstyp === "Tiondelar" ? 1 : 2);
            setSpelTal(nyaSpelTal);
        } else {
            const steg = avrundningstyp === "Heltal" ? 1 : avrundningstyp === "Tiondelar" ? 0.1 : 0.01;
            const nyaTal = (parseFloat(tal) + steg).toFixed(avrundningstyp === "Heltal" ? 0 : avrundningstyp === "Tiondelar" ? 1 : 2);
            setTal(nyaTal);
        }
    };

    const minskaVärde = () => {
        if (spellaege) {
            const steg = avrundningstyp === "Heltal" ? 1 : avrundningstyp === "Tiondelar" ? 0.1 : 0.01;
            const nyaSpelTal = (parseFloat(spelTal) - steg).toFixed(avrundningstyp === "Heltal" ? 0 : avrundningstyp === "Tiondelar" ? 1 : 2);
            setSpelTal(nyaSpelTal);
        } else {
            const steg = avrundningstyp === "Heltal" ? 1 : avrundningstyp === "Tiondelar" ? 0.1 : 0.01;
            const nyaTal = (parseFloat(tal) - steg).toFixed(avrundningstyp === "Heltal" ? 0 : avrundningstyp === "Tiondelar" ? 1 : 2);
            setTal(nyaTal);
        }
    };

    const ökaMedTiondel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) + 0.1).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) + 0.1).toFixed(3);
            setTal(nyaTal);
        }
    };

    const minskaMedTiondel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) - 0.1).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) - 0.1).toFixed(3);
            setTal(nyaTal);
        }
    };

    const ökaMedHundradel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) + 0.01).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) + 0.01).toFixed(3);
            setTal(nyaTal);
        }
    };

    const minskaMedHundradel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) - 0.01).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) - 0.01).toFixed(3);
            setTal(nyaTal);
        }
    };

    const ökaMedTusendel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) + 0.001).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) + 0.001).toFixed(3);
            setTal(nyaTal);
        }
    };

    const minskaMedTusendel = () => {
        if (spellaege) {
            const nyaSpelTal = (parseFloat(spelTal) - 0.001).toFixed(3);
            setSpelTal(nyaSpelTal);
        } else {
            const nyaTal = (parseFloat(tal) - 0.001).toFixed(3);
            setTal(nyaTal);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-8 space-y-8"
        >
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
            >
                Träna på att avrunda tal
            </motion.h1>
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100"
            >
                <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                    <div className="flex flex-col space-y-2 w-full sm:w-1/2">
                        <Label htmlFor="tal" className="text-sm font-medium text-gray-700">
                            {spellaege ? "Övningstal:" : "Ange ett tal:"}
                        </Label>
                        <Input
                            id="tal"
                            type="number"
                            value={spellaege ? spelTal : tal}
                            onChange={(e) => spellaege ? setSpelTal(e.target.value) : setTal(e.target.value)}
                            className="rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={spellaege}
                        />
                    </div>
                    
                    <div className="flex flex-col space-y-2 w-full sm:w-1/2">
                        <Label htmlFor="avrundningstyp" className="text-sm font-medium text-gray-700">
                            Avrunda till:
                        </Label>
                        <Select
                            value={avrundningstyp}
                            onValueChange={setAvrundningstyp}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all">
                                <SelectValue placeholder="Välj avrundningstyp" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border-gray-100 bg-white/95 backdrop-blur-md">
                                <SelectItem value="Heltal">Heltal</SelectItem>
                                <SelectItem value="Tiondelar">Tiondelar</SelectItem>
                                <SelectItem value="Hundradelar">Hundradelar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-full overflow-x-auto bg-gray-50 rounded-2xl p-3 border border-gray-100 mb-6"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-[150px] rounded-xl"
                        style={{ touchAction: 'manipulation' }}
                    />
                    
                    <Collapsible 
                        open={isAdjustOpen} 
                        onOpenChange={setIsAdjustOpen}
                        className="mt-4"
                    >
                        <CollapsibleTrigger className="flex items-center justify-center w-full p-2 bg-blue-50 rounded-xl border border-blue-100 mb-2 hover:bg-blue-100 transition-colors">
                            <span className="text-sm font-medium text-blue-700 mr-2">
                                {isAdjustOpen ? "Dölj justeringskontroller" : "Visa justeringskontroller"}
                            </span>
                            {isAdjustOpen ? 
                                <ChevronUp className="h-4 w-4 text-blue-600" /> : 
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                            }
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="space-y-4">
                            <div className="flex justify-center items-center p-2 bg-blue-50 rounded-xl border border-blue-100">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={minskaMedTiondel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-blue-200 hover:bg-blue-100 shadow-sm mr-3"
                                >
                                    <Minus className="h-4 w-4 mr-2 text-blue-600" /> 0.1
                                </Button>
                                <span className="text-sm font-medium text-blue-700 mx-2">Justera tiondel</span>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={ökaMedTiondel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-blue-200 hover:bg-blue-100 shadow-sm ml-3"
                                >
                                    <Plus className="h-4 w-4 mr-2 text-blue-600" /> 0.1
                                </Button>
                            </div>
                            
                            <div className="flex justify-center items-center p-2 bg-indigo-50 rounded-xl border border-indigo-100">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={minskaMedHundradel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-indigo-200 hover:bg-indigo-100 shadow-sm mr-3"
                                >
                                    <Minus className="h-4 w-4 mr-2 text-indigo-600" /> 0.01
                                </Button>
                                <span className="text-sm font-medium text-indigo-700 mx-2">Justera hundradel</span>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={ökaMedHundradel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-indigo-200 hover:bg-indigo-100 shadow-sm ml-3"
                                >
                                    <Plus className="h-4 w-4 mr-2 text-indigo-600" /> 0.01
                                </Button>
                            </div>
                            
                            <div className="flex justify-center items-center p-2 bg-purple-50 rounded-xl border border-purple-100">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={minskaMedTusendel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-purple-200 hover:bg-purple-100 shadow-sm mr-3"
                                >
                                    <Minus className="h-4 w-4 mr-2 text-purple-600" /> 0.001
                                </Button>
                                <span className="text-sm font-medium text-purple-700 mx-2">Justera tusendel</span>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={ökaMedTusendel}
                                    className="px-4 py-2 h-10 text-sm rounded-xl bg-white border border-purple-200 hover:bg-purple-100 shadow-sm ml-3"
                                >
                                    <Plus className="h-4 w-4 mr-2 text-purple-600" /> 0.001
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </motion.div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex flex-col space-y-2 w-full sm:w-1/3">
                            <Label htmlFor="elevsvar" className="text-sm font-medium text-gray-700">
                                Ditt svar:
                            </Label>
                            <Input
                                id="elevsvar"
                                type="number"
                                value={elevSvar}
                                onChange={(e) => setElevSvar(e.target.value)}
                                className="rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Skriv ditt svar här"
                            />
                        </div>
                        
                        <Button 
                            onClick={hanteraSvar} 
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                        >
                            Kontrollera svar
                        </Button>
                        
                        <Button 
                            onClick={startaSpel} 
                            variant="outline"
                            className="w-full sm:w-auto rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-300"
                        >
                            {spellaege ? "Avsluta övningsläge" : "Starta övningsläge"}
                        </Button>
                    </div>

                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "p-4 rounded-xl text-center font-medium shadow-sm",
                                feedback.includes("Rätt") 
                                    ? "bg-green-50 text-green-800 border border-green-100" 
                                    : "bg-red-50 text-red-800 border border-red-100"
                            )}
                        >
                            {feedback}
                        </motion.div>
                    )}
                </div>
            </motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm text-center text-gray-500 italic"
            >
                Använd tallinjen för att visualisera avrundningen.
            </motion.p>
        </motion.div>
    );
};

export default Avrundningshjalpmedel;
