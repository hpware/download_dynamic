find . -type f -name "*.js" -not -path "./node_modules/*" -print0 | while IFS= read -r -d $'\0' file; do
  bunx uglifyjs "$file" \
    --compress --v8 --webkit --comments "Copyright MIT LICENSE $(bun run scripts:getcurrentyear) Yuan-Hau Wu (yuanhau.com)" -o "$file"
done
