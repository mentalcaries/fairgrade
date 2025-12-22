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
import { signIn } from '~/lib/auth-client';
import { toast } from 'vue-sonner';
import Spinner from './ui/spinner/Spinner.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const isSubmitting = ref(false);
const formSchema = toTypedSchema(
  z.object({
    email: z.email('Email is required'),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const { data } = await signIn.magicLink({
      email: values.email,
      callbackURL: '/dashboard',
      errorCallbackURL: '/login',
    });
    if (data) {
      await navigateTo(
        `/login/check-email?email=${encodeURIComponent(values.email)}`
      );
    }
  } catch (error) {
    console.error('Magic link login failed', error);
    toast.error('Failed to send magic link. Please try again.');
    return;
  } finally {
    isSubmitting.value = false;
  }
});

const handleGoogleSignIn = async () => {
  signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });
};
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
          <Button variant="outline" type="button" @click="handleGoogleSignIn">
            <img src="/google.svg" alt="Google Logo" class="h-5 w-5" />
            Login with Google
          </Button>
        </div>
        <FieldSeparator
          class="*:data-[slot=field-separator-content]:bg-card my-6"
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
            <Field>
              <Button type="submit" :disabled="isSubmitting">
                <Spinner v-if="isSubmitting" class="size-4" />
                {{ isSubmitting ? 'Sending' : 'Login with Magic Link' }}
              </Button>
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
