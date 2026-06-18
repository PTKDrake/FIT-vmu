import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../wayfinder";
/**
 * @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
 * @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
 * @route '/cms/ai/blocknote'
 */
export const blocknote = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: blocknote.url(options),
  method: "post",
});

blocknote.definition = {
  methods: ["post"],
  url: "/cms/ai/blocknote",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
 * @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
 * @route '/cms/ai/blocknote'
 */
blocknote.url = (options?: RouteQueryOptions) => {
  return blocknote.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
 * @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
 * @route '/cms/ai/blocknote'
 */
blocknote.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: blocknote.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
 * @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
 * @route '/cms/ai/blocknote'
 */
const blocknoteForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: blocknote.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\Cms\StreamBlockNoteAiController::__invoke
 * @see app/Http/Controllers/Cms/StreamBlockNoteAiController.php:16
 * @route '/cms/ai/blocknote'
 */
blocknoteForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: blocknote.url(options),
  method: "post",
});

blocknote.form = blocknoteForm;

const ai = {
  blocknote: Object.assign(blocknote, blocknote),
};

export default ai;
