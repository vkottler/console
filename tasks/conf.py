"""
A module for project-specific task registration.
"""

# built-in
from pathlib import Path
from typing import Dict

# third-party
from vcorelib.task import Inbox, Outbox, Phony
from vcorelib.task.manager import TaskManager
from vcorelib.task.subprocess.run import SubprocessLogMixin, is_windows


class Npx(SubprocessLogMixin):
    """A task that runs npx."""

    async def run(self, inbox: Inbox, outbox: Outbox, *args, **kwargs) -> bool:
        """Run command."""
        return await self.exec("npx", *args)


def register(
    manager: TaskManager,
    project: str,
    cwd: Path,
    substitutions: Dict[str, str],
) -> bool:
    """Register project tasks to the manager."""

    del substitutions

    # Ensure that the 'hooks' directory is seen by cookiecutter.
    proj_dir = cwd.joinpath(project)
    if not proj_dir.exists():
        proj_dir.symlink_to("src", target_is_directory=True)

    src = str(cwd.joinpath("src"))
    tests = str(cwd.joinpath("tests"))

    # Project tasks.
    manager.register(Npx("build", "parcel", "build"))
    manager.register(Npx("host", "parcel", "--no-cache"))

    # Formatting.
    manager.register(Npx("eslint-format", "eslint", "--fix", src, tests))
    manager.register(Npx("prettier-format", "prettier", "-w", src, tests))
    manager.register(Phony("format"), ["eslint-format", "prettier-format"])

    # Linting.
    manager.register(Npx("eslint-lint", "eslint", src, tests))
    manager.register(Npx("prettier-lint", "prettier", "--check", src, tests))
    manager.register(Phony("lint"), ["eslint-lint", "prettier-lint"])

    # Testing.
    manager.register(Npx("test", "jest", "--coverage"))

    # Don't run yamllint on Windows because it will fail on newlines.
    manager.register(
        Phony("yaml"),
        [] if is_windows() else ["yaml-lint-local", "yaml-lint-manifest.yaml"],
    )
    return True
