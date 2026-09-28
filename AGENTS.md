<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the product storefront in a shared component rendered at both `/` and `/p/ferramentas`, so the requested product URL and the default preview remain consistent.
- Store copied reference media through Lovable asset pointers, not source-site hotlinks, so product imagery remains available independently of the reference website.
