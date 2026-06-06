import { AdminModule } from "../modules/admin.module";
import { ApplicationModule } from "../modules/application.module";
import { AuthModule } from "../modules/auth.module";
import { RequestApplicationModule } from "../modules/requestApplication.module";
import { DbModule } from "../modules/db.module";
import { RegisterModule } from "../modules/register.module";

export const modules = [
  AdminModule,
  ApplicationModule,
  AuthModule,
  RequestApplicationModule,
  DbModule,
  RegisterModule,
];
