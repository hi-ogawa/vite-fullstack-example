# prisma schema

use prisma only as a schema-diff tool.

```sh
# 0. edit schema.prisma

# 1. create up/down migrations
bash prisma/create-migration.sh create-xxx-table

# 2. apply migration
pnpm migrate up
```
