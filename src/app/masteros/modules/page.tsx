import { requireSuperAdmin } from "@/lib/masteros/auth";
import { createServiceClient } from "@/lib/supabase/client-or-service";
import type { Database } from "@/lib/supabase/types";
import { ModulesClient } from "./ModulesClient";

export const dynamic = "force-dynamic";

type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];

const DEMO_ITEMS: ContentItem[] = [
  {
    id: "demo-001",
    module: "bellboy",
    level: "A1",
    skill: "listening",
    item_type: "drill",
    audio_text: "Welcome, sir. May I help you with your bags?",
    audio_url: null,
    options: [
      { en: "Yes, please.", correct: true },
      { en: "No, thank you.", correct: false },
      { en: "I am hungry.", correct: false },
    ],
    scenario_es: null,
    expected_keywords: null,
    model_response: null,
    model_response_audio_url: null,
    word: null,
    word_audio_url: null,
    topic: "saludo · llegada",
    is_active: true,
    usage_count: 312,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "demo-002",
    module: "frontdesk",
    level: "A2",
    skill: "speaking",
    item_type: "drill",
    audio_text: null,
    audio_url: null,
    options: null,
    scenario_es:
      "Un huésped llega sin reservación. Saludarlo y ofrecerle disponibilidad.",
    expected_keywords: ["good morning", "available", "let me check", "room"],
    model_response:
      "Good morning! Welcome. Let me check our availability for you.",
    model_response_audio_url: null,
    word: null,
    word_audio_url: null,
    topic: "check-in · sin reservación",
    is_active: true,
    usage_count: 187,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "demo-003",
    module: "restaurant",
    level: "B1",
    skill: "vocabulary",
    item_type: "drill",
    audio_text: null,
    audio_url: null,
    options: null,
    scenario_es: null,
    expected_keywords: null,
    model_response: null,
    model_response_audio_url: null,
    word: "appetizer",
    word_audio_url: null,
    topic: "menú · entradas",
    is_active: true,
    usage_count: 64,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default async function ModulesPage() {
  await requireSuperAdmin();

  const sb = createServiceClient();
  let items: ContentItem[] = [];
  let demo = false;
  if (!sb) {
    items = DEMO_ITEMS;
    demo = true;
  } else {
    const { data, error } = await sb
      .from("content_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) {
      items = DEMO_ITEMS;
      demo = true;
    } else if (data.length === 0) {
      items = DEMO_ITEMS;
      demo = true;
    } else {
      items = data;
    }
  }

  return <ModulesClient initial={items} demo={demo} />;
}
