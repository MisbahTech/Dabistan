import { connectDb, disconnectDb } from './mongoose.js';
import { ensureAdminUser } from '../utils/seedAdmin.js';
async function createAdmin() {
    await connectDb();
    await ensureAdminUser();
}
createAdmin()
    .then(async () => {
    await disconnectDb();
    console.log('Admin seed complete');
})
    .catch(async (error) => {
    console.error(error);
    await disconnectDb();
    process.exitCode = 1;
});
//# sourceMappingURL=create-admin.js.map