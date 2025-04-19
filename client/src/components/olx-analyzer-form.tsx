import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

// Define types for the form and API response
interface AnalyzeFormValues {
  url: string;
}

interface AnalyzeResponse {
  data: {
    analysis: string;
    totalTokens: number;
    imageUrls: string[];
    title: string;
  };
  error?: string;
}

interface ApiError {
  response?: {
    data?: {
      error: string;
    };
  };
  message: string;
}

export function OlxAnalyzerForm() {
  // State to store the API response
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResponse | null>(null);

  // Initialize react-hook-form
  const form = useForm<AnalyzeFormValues>({
    defaultValues: {
      url: ""
    },
    resolver: async (values) => {
      const errors: Record<string, { type: string; message: string }> = {};
      
      if (!values.url) {
        errors.url = {
          type: 'required',
          message: 'URL je obavezan',
        };
      } else if (!values.url.startsWith('https://olx.ba/')) {
        errors.url = {
          type: 'pattern',
          message: 'Unesite važeći OLX URL',
        };
      }
      
      return {
        values: Object.keys(errors).length === 0 ? values : {},
        errors,
      };
    }
  });

  // Set up TanStack Query mutation
  const analyzeMutation = useMutation<AnalyzeResponse, ApiError, AnalyzeFormValues>({
    mutationFn: async (values) => {
      if (!values.url.startsWith('https://olx.ba/')) {
        throw new Error('Molimo unesite važeći OLX URL');
      }
      const response = await axios.post("http://localhost:4000/api/analyze", { url: values.url });
      return response.data;
    },
    onSuccess: (data) => {
      setAnalyzeResult(data);
    },
  });

  // Form submission handler
  const onSubmit = (values: AnalyzeFormValues) => {
    analyzeMutation.mutate(values);
  };
console.log(analyzeResult)
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md mx-auto ">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OLX Ad URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.olx.ba/..." {...field} />
                </FormControl>
                <FormDescription>
                  Enter the URL of an OLX advertisement you want to analyze.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={analyzeMutation.isPending}
          >
            {analyzeMutation.isPending ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </Form>

      {/* Show result card when data is available */}
      {analyzeResult && (
        <Card className="mt-8 text-left">
          <CardHeader>
            <CardTitle>{analyzeResult.data.title}</CardTitle>
            <CardDescription>Results from analyzing the OLX ad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyzeResult.data.imageUrls.slice(0, 6).map((url, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <img src={url} alt={`Car image ${index + 1}`} className="object-cover w-full h-full hover:scale-105 transition-transform duration-200" />
                </div>
              ))}
            </div>
            <ReactMarkdown>
              {analyzeResult?.data?.analysis ?? ""}
            </ReactMarkdown>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => setAnalyzeResult(null)}
            >
              Clear Result
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Show error message if the mutation failed */}
      {analyzeMutation.isError && (
        <Card className="mt-8 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-left max-w-none">{analyzeMutation.error.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
