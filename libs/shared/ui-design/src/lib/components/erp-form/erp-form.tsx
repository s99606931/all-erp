
"use client"

import { useForm, DefaultValues, FieldValues, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

interface ERPFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>
  defaultValues?: DefaultValues<T>
  onSubmit: SubmitHandler<T>
  submitLabel?: string
  // Simple field mapping for auto-generation. 
  // For complex cases, children can be used, but this "AutoForm" mode handles basic string/number fields.
  fields?: {
    name: keyof T
    label: string
    type?: string
    description?: string
  }[]
}

export function ERPForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  fields,
}: ERPFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {fields && fields.map((field) => (
          <FormField
            key={String(field.name)}
            control={form.control as any}
            name={field.name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    type={field.type || "text"} 
                    placeholder={field.label} 
                    {...formField} 
                    value={formField.value || ''}
                    onChange={e => {
                      // Basic number handling
                      if (field.type === 'number') {
                        const val = parseFloat(e.target.value);
                        formField.onChange(isNaN(val) ? 0 : val);
                      } else {
                        formField.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  )
}
