import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Avrundningshjalpmedel = () => {
  const [numberToRound, setNumberToRound] = useState<number | null>(null);
  const [decimalPlaces, setDecimalPlaces] = useState<number>(0);
  const [roundedNumber, setRoundedNumber] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<boolean>(false);
  const [gameNumber, setGameNumber] = useState<number | null>(null);
  const [gameDecimalPlaces, setGameDecimalPlaces] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tallinjeValue, setTallinjeValue] = useState<number>(0);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  const roundNumber = useCallback(() => {
    if (numberToRound === null) return;
    const multiplier = Math.pow(10, decimalPlaces);
    const rounded = Math.round(numberToRound * multiplier) / multiplier;
    setRoundedNumber(rounded);
    setTallinjeValue(rounded);
    setAnimationTrigger(true);
  }, [numberToRound, decimalPlaces]);

  useEffect(() => {
    if (numberToRound !== null) {
      roundNumber();
    }
  }, [numberToRound, decimalPlaces, roundNumber]);

  const startGameMode = () => {
    const newNumber = Math.random() * 100; // Slumpmässigt tal mellan 0 och 100
    const newDecimalPlaces = Math.floor(Math.random() * 3); // Slumpmässigt antal decimaler mellan 0 och 2
    setGameNumber(newNumber);
    setGameDecimalPlaces(newDecimalPlaces);
    setRoundedNumber(null);
    setUserGuess('');
    setIsCorrect(null);
    setGameMode(true);
  };

  const checkGuess = () => {
    if (gameNumber === null) return;
    const multiplier = Math.pow(10, gameDecimalPlaces);
    const correctRoundedNumber = Math.round(gameNumber * multiplier) / multiplier;
    const userGuessNumber = Number(userGuess);

    if (!isNaN(userGuessNumber) && userGuessNumber === correctRoundedNumber) {
      setIsCorrect(true);
      toast({
        title: "Rätt!",
        description: "Bra jobbat! Du gissade rätt.",
      })
    } else {
      setIsCorrect(false);
      toast({
        variant: "destructive",
        title: "Fel!",
        description: `Försök igen. Rätt svar är ${correctRoundedNumber}`,
      })
    }
  };

  const exitGameMode = () => {
    setGameMode(false);
    setGameNumber(null);
    setGameDecimalPlaces(0);
    setUserGuess('');
    setIsCorrect(null);
  };

  const handleSliderChange = (value: number[]) => {
    setTallinjeValue(value[0]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6 mt-12"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Avrundningshjälpmedel
        </h1>

        {!gameMode ? (
          <>
            <div className="mb-4">
              <Label htmlFor="numberToRound" className="block text-gray-700 text-sm font-bold mb-2">
                Ange ett tal att avrunda:
              </Label>
              <Input
                type="number"
                id="numberToRound"
                placeholder="T.ex. 3.14159"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setNumberToRound(Number(e.target.value))}
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="decimalPlaces" className="block text-gray-700 text-sm font-bold mb-2">
                Antal decimaler:
              </Label>
              <div className="flex items-center space-x-4">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
                <Slider
                  id="decimalPlaces"
                  defaultValue={[0]}
                  max={5}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => setDecimalPlaces(value[0])}
                />
                <ArrowRight className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{decimalPlaces}</span>
              </div>
            </div>

            {roundedNumber !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="mb-6"
              >
                <p className="text-gray-700">
                  Avrundat tal: <span className="font-semibold">{roundedNumber}</span>
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <Label className="block text-gray-700 text-sm font-bold mb-2">
                Tallinje:
              </Label>
              <Slider
                defaultValue={[numberToRound || 0]}
                min={(numberToRound || 0) - 1}
                max={(numberToRound || 0) + 1}
                step={0.1}
                onValueChange={(value) => handleSliderChange(value)}
                aria-label="Tallinje"
              />
              <p className="text-gray-700 mt-2">
                Valt värde: {tallinjeValue}
              </p>
            </motion.div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-green-500 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                  Starta övningsläge
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    När du startar övningsläget kommer du att få slumpmässiga tal att avrunda.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={startGameMode}>Starta</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Övningsläge
            </h2>
            <p className="text-gray-700">
              Avrunda <span className="font-semibold">{gameNumber?.toFixed(5)}</span> till{' '}
              <span className="font-semibold">{gameDecimalPlaces}</span> decimaler:
            </p>
            <Input
              type="number"
              placeholder="Ditt svar"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
            />
            <Button onClick={checkGuess} className="w-full">
              Kontrollera svar
            </Button>
            {isCorrect !== null && (
              <p className={isCorrect ? 'text-green-500' : 'text-red-500'}>
                {isCorrect ? 'Rätt!' : 'Fel. Försök igen.'}
              </p>
            )}
            <Button 
              variant="destructive"
              onClick={exitGameMode}
              className="mt-4"
            >
              Avsluta övningsläge
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Avrundningshjalpmedel;
