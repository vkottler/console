"""
A module for project-specific task registration.
"""

# built-in
from pathlib import Path
from typing import Dict

# third-party
from vcorelib.task import Phony
from vcorelib.task.manager import TaskManager
from vcorelib.task.subprocess.run import is_windows


def register(
    manager: TaskManager,
    project: str,
    cwd: Path,
    substitutions: Dict[str, str],
) -> bool:
    """Register project tasks to the manager."""

    del substitutions

    # Ensure that the project directory is linked to 'src'.
    proj_dir = cwd.joinpath(project)
    if not proj_dir.exists():
        proj_dir.symlink_to("src", target_is_directory=True)

    # Don't run yamllint on Windows because it will fail on newlines.
    manager.register(
        Phony("yaml"),
        [] if is_windows() else ["yaml-lint-local", "yaml-lint-manifest.yaml"],
    )
    return True
