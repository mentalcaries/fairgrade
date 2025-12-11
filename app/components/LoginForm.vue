<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate';
import { FormMessage, type FormItem } from './ui/form';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const formSchema = toTypedSchema(
  z.object({
    email: z.email(),
    password: z.string().min(8),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values);
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> Welcome back </CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4 flex w-full flex-col">
          <Button variant="outline" type="button">
            <img src="/apple.svg" alt="Apple Logo" class="h-5 w-5" />
            Login with Apple
          </Button>
          <Button variant="outline" type="button">
            <img src="/google.svg" alt="Google Logo" class="h-5 w-5" />
            Login with Google
          </Button>
        </div>
        <FieldSeparator
          class="*:data-[slot=field-separator-content]:bg-card my-4"
        >
          Or continue with
        </FieldSeparator>
        <form @submit="onSubmit">
          <FieldGroup>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FieldLabel for="email"> Email </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  v-bind="componentField"
                />
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <div class="flex items-center">
                  <FieldLabel for="password"> Password </FieldLabel>
                </div>
                <Input id="password" type="password" v-bind="componentField" />
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
                <FormMessage />
              </FormItem>
            </FormField>
            <Field>
              <Button type="submit"> Login </Button>

            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      By clicking Login, you agree to our
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </FieldDescription>
  </div>
</template>
